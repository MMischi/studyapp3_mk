import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import {
  getStudykitIdFromRout,
  randomizeStudycards,
  getStringSimilarity,
  checkanswerOfTextarea,
  checkMultipleAnswer,
  isMultiplechoiceAnswerRight,
} from "../../services/_utils/helper";
import { DataService } from "src/app/services/data.service";

import { Answer } from "src/app/services/_interfaces/answer";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

@Component({
  selector: "app-learn-studycard",
  templateUrl: "./learn-studycard.page.html",
  styleUrls: ["./learn-studycard.page.scss"],
})
export class LearnStudycardPage implements OnInit {
  constructor(
    private service: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

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
  isShowAnswer: boolean = false; // whether to show the answers
  answerSimilarity: number = 0; // text similarity in percent
  answerOfTextarea: string = ""; // text from textarea (card type: text)
  checkedMultipleAnswerIdArray: string[] = []; // the array containes checked answers (card type: multiple)

  ngOnInit() {}

  async ionViewWillEnter() {
    const routeParam: string = getStudykitIdFromRout(this.route);
    if (routeParam !== null) {
      this.initLearning(routeParam);
    }
  }

  /* -------------------------------------- */
  /* init learning */
  /* -------------------------------------- */
  /**
   * Prepare studykit for learning
   */
  async initLearning(studykitId: string) {
    this.isShowAnswer = false;
    this.studykit = await this.service.getStudykitById(studykitId);
    this.studycardArray = this.getStudycardsWhereNextDateIsBeforeToday(
      this.studykit.cards
    );
    this.studycardArray = randomizeStudycards(this.studycardArray);
    this.cardToShow = this.studycardArray[this.cardIndex];
  }

  /**
   * Filters studycard where card property nextLearnDate <= today
   * @param { Card[] } allCards
   * @returns { Card[] } set of cards where nextLearnDate <= today
   */
  getStudycardsWhereNextDateIsBeforeToday(allCards: Card[]): Card[] {
    return allCards.filter((card: Card) => card.nextLearnDate <= new Date());
  }

  /* -------------------------------------- */
  /* navigation */
  /* -------------------------------------- */
  /**
   * Navigate to the next card, or to /home if it was the last card
   */
  trySwitchToNextCard() {
    if (this.cardIndex < this.studycardArray.length - 1) {
      this.cardIndex++;
      this.cardToShow = this.studycardArray[this.cardIndex];
    } else {
      this.redirectToHome();
    }
    this.resetShowAnswer();
  }

  /**
   * Redirects to home route
   */
  redirectToHome() {
    this.presentToast(
      "bottom",
      "success",
      "Du hast alle Lernkarten von diesem Set gelernt"
    );
    this.router.navigate(["/home"]);
  }

  /**
   * Resets every element, which contains answers
   */
  resetShowAnswer() {
    this.isShowAnswer = false;
    this.answerSimilarity = 0;
    this.answerOfTextarea = "";
    this.checkedMultipleAnswerIdArray = [];
  }

  /* -------------------------------------- */
  /* check answers */
  /* -------------------------------------- */
  /**
   * Compares the inserted answers, with the saved answers
   */
  checkAnswer() {
    this.isShowAnswer = true;

    let isValide: boolean = false;
    if (this.cardToShow.type === "multiple") {
      isValide = checkMultipleAnswer(
        this.cardToShow,
        this.checkedMultipleAnswerIdArray
      );
    } else if (this.cardToShow.type === "text") {
      this.answerSimilarity = getStringSimilarity(
        this.answerOfTextarea,
        this.cardToShow.answers[0].toString()
      );
      isValide = checkanswerOfTextarea(this.answerSimilarity);
    }
    this.handleResult(isValide);
  }

  /**
   * Calls the suitable function to give feedback to the user if the answers are correct
   * and updates card properties
   * @param { boolean } isValide
   */
  handleResult(isValide: boolean) {
    isValide ? this.processSuccess() : this.processFail();
    this.updateCardProperties();
  }

  /**
   * Gives the user feedback that the answers are correct
   */
  processSuccess() {
    this.presentToast("bottom", "success", "Richtig beantwortet. Weiter so!");
    this.cardToShow.repetitionTimes++;
  }

  /**
   * Gives the user feedback that the answers aren't correct
   */
  processFail() {
    this.presentToast(
      "bottom",
      "danger",
      "Nicht richtig beantwortet. Beim nächsten Mal klappts besser!"
    );
    this.cardToShow.repetitionTimes = 0;
  }

  /**
   * Updates studycard in local storages
   */
  async updateCardProperties() {
    let today = new Date();
    this.cardToShow.lastLearnedOn = today;
    this.cardToShow.nextLearnDate.setDate(
      today.getDate() +
        this.getNextLearnDateByRepetition(this.cardToShow.repetitionTimes)
    );
    await this.service.updateCardInStudykit(this.studykit.id, this.cardToShow);
  }

  /**
   * Returns after how many days the card should be learned again
   * @param { number } repetitionTime descibes how many times the map has already been repeated
   * @returns { number } 
   */
  getNextLearnDateByRepetition(repetitionTime: number): number {
    switch (repetitionTime) {
      case 0:
        return 1;
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 4;
      case 4:
        return 7;
    }
  }

  /* -------------------------------------- */
  /* others */
  /* -------------------------------------- */
  /**
   * Checks whether the correct answer has also been marked 
   * @param { Answer } answer correct answer
   * @returns { boolean }
   */
  isAnswerAlsoChecked(answer: Answer): boolean {
    return isMultiplechoiceAnswerRight(
      answer,
      this.checkedMultipleAnswerIdArray
    );
  }

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

  /**
   * Shows toast
   * @param {string} position "top" | "middle" | "bottom"
   * @param {string} color "danger" | "warning" | "primary" | "light" | "success"
   * @param {string} msg individual
   */
  async presentToast(
    position: "top" | "middle" | "bottom",
    color: "danger" | "warning" | "primary" | "light" | "success",
    msg: string
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: position,
      color: color,
    });

    await toast.present();
  }
}
