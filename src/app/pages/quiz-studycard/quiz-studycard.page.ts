import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import {
  checkanswerOfTextarea,
  checkMultipleAnswer,
  getStringSimilarity,
  getStudykitIdFromRout,
  randomizeStudycards,
} from "../../services/_utils/helper";
import { DataService } from "src/app/services/data.service";

import { Answer } from "src/app/services/_interfaces/answer";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

interface UserTextAnswer {
  cardId: string;
  userAnswer: string;
  textSimilarty: number;
}
interface UserMultipleChoiceAnswer {
  cardId: string;
  checkedIdxs: string[];
}

@Component({
  selector: "app-quiz-studycard",
  templateUrl: "./quiz-studycard.page.html",
  styleUrls: ["./quiz-studycard.page.scss"],
})
export class QuizStudycardPage implements OnInit {
  studycards: Card[] = [
    {
      id: "",
      lastLearnedOn: new Date(),
      nextLearnDate: new Date(),
      repetitionTimes: 0,
      type: "",
      question: "",
      answers: [],
    },
  ];
  studykit: Studykit = {
    id: "",
    title: "",
    cards: this.studycards,
  };

  // values to describe shown cards
  cardIndex: number = 0; // index of card of card, which the user sees
  studycardArray: Card[] = []; // studycards of studykit
  cardToShow: Card = {
    id: "",
    lastLearnedOn: new Date(),
    nextLearnDate: new Date(),
    repetitionTimes: 0,
    type: "",
    question: "",
    answers: [],
  }; // current shown card

  // values to handle answer or question
  showResult: boolean = false;
  answerSimilarity: number = 0; // text similarity in percent
  answerOfTextarea: string = ""; // text from textarea (card type: text)
  checkedMultipleAnswerIdArray: string[] = []; // the array containes checked answers (card type: multiple)

  // remember answers
  correctAnswers: Card[] = [];
  incorrectAnswers: Card[] = [];
  userTextAnswers: UserTextAnswer[] = [];
  userMultipleChoiceAnswers: UserMultipleChoiceAnswer[] = [];

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    const routeParam: string = getStudykitIdFromRout(this.route);
    if (routeParam !== null) {
      this.initLearning(routeParam);
    }
  }

  /* -------------------------------------- */
  /* init quiz */
  /* -------------------------------------- */
  /**
   * Prepare studykit for quiz
   */
  async initLearning(studykitId: string) {
    this.studykit = await this.service.getStudykitById(studykitId);
    this.studycardArray = randomizeStudycards(this.studykit.cards);
    this.cardToShow = this.studycardArray[this.cardIndex];
  }

  /* -------------------------------------- */
  /* check answers */
  /* -------------------------------------- */
  /**
   * Compares the inserted answers, with the saved answers
   */
  checkAnswer() {
    let isValide: boolean = false;
    if (this.cardToShow.type === "multiple") {
      isValide = checkMultipleAnswer(
        this.cardToShow,
        this.checkedMultipleAnswerIdArray
      );
      this.userMultipleChoiceAnswers.push({
        cardId: this.cardToShow.id,
        checkedIdxs: this.checkedMultipleAnswerIdArray,
      });
    } else if (this.cardToShow.type === "text") {
      this.answerSimilarity = getStringSimilarity(
        this.answerOfTextarea,
        this.cardToShow.answers[0].toString()
      );
      isValide = checkanswerOfTextarea(this.answerSimilarity);
      this.userTextAnswers.push({
        cardId: this.cardToShow.id,
        userAnswer: this.answerOfTextarea,
        textSimilarty: this.answerSimilarity,
      });
    }
    this.handleResult(isValide);
  }

  /**
   * Calls the suitable function to give feedback to the user if the answers are correct
   * and updates card properties
   * @param { boolean } isValide
   */
  handleResult(isValide: boolean) {
    isValide
      ? this.correctAnswers.push(this.cardToShow)
      : this.incorrectAnswers.push(this.cardToShow);
    this.trySwitchToNextCard();
  }

  /**
   * Navigate to the next card, or to /home if it was the last card
   */
  trySwitchToNextCard() {
    if (this.cardIndex < this.studycardArray.length - 1) {
      this.cardIndex++;
      this.cardToShow = this.studycardArray[this.cardIndex];
    } else {
      this.showResult = true;
    }
    this.resetCheckValues();
  }

  /**
   * Resets every element, which contains answers
   */
  resetCheckValues() {
    this.answerSimilarity = 0;
    this.answerOfTextarea = "";
    this.checkedMultipleAnswerIdArray = [];
  }

  /* -------------------------------------- */
  /* others */
  /* -------------------------------------- */
  /**
   * Writes/drops answer id to checkedMultipleAnswerIdArray
   *    - array contains all answers marked by the user
   * @param { Answer } answer clicked answer
   */
  onStatusChange(answer: Answer) {
    if (this.checkedMultipleAnswerIdArray.includes(answer.id)) {
      this.checkedMultipleAnswerIdArray =
        this.checkedMultipleAnswerIdArray.filter((value) => value != answer.id);
    } else {
      this.checkedMultipleAnswerIdArray.push(answer.id);
    }
  }

  getUserTextAnswer(cardId: string) {
    return this.userTextAnswers.filter((elem: UserTextAnswer) => elem.cardId === cardId)[0];

  isAnswerChecked(cardId: string, answerId: string): boolean {
    const userAnswers: string[] = this.userMultipleChoiceAnswers.filter(
      (elem: UserMultipleChoiceAnswer) => elem.cardId === cardId
    )[0].checkedIdxs;
    return userAnswers.filter((elem: string) => elem === answerId).length > 0;
  }
}
