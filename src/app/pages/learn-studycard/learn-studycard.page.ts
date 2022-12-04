import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import {
  getStudykitIdFromRout,
  generateRandomizedIndexesOf,
  getNextRandomizedCardFromStudykit,
} from "../../services/_utils/helper";
import { DataService } from "src/app/services/data.service";

import { Answer } from "src/app/services/_interfaces/answer";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

import stringSimilarity from "../../../../node_modules/string-similarity";

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
  indexOfShownCard: number = 0; // index of card of card, which the user sees
  indexFromRandomizedCardSet: number = 0; // index of card in randomized card set
  studycardArray: Card[] = []; // studycards of studykit
  indexRandomized: number[] = []; // randomized index of studycards
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
  answerSimilarity: Number = 0; // text similarity in percent
  answerOfTextarea: String = ""; // text from textarea (card type: text)
  checkedMultipleAnswerIdArray: String[] = []; // the array shows which answers are checked (card type: multiple)

  ngOnInit() {}

  async ionViewWillEnter() {
    const routeParamStudykitId = getStudykitIdFromRout(this.route);
    if (routeParamStudykitId !== null) {
      this.studykit = await this.service.getStudykitById(routeParamStudykitId);
      await this.initLearning(routeParamStudykitId);
      this.cardToShow = this.studycardArray[this.indexFromRandomizedCardSet];
    }
    this.isShowAnswer = false;
  }

  /**
   * set initinal values to show right studycards
   * @param { string } studykitId id of studykit
   */
  async initLearning(studykitId: string) {
    this.studykit = await this.service.getStudykitById(studykitId);
    this.studycardArray = this.studykit.cards.filter(
      (card: Card) => card.nextLearnDate <= new Date()
    );
    this.indexRandomized = generateRandomizedIndexesOf(
      this.studycardArray.length
    );
    this.indexFromRandomizedCardSet =
      this.indexRandomized[this.indexOfShownCard];
  }

  /**
   * direct to next studycard or redirect to home if it was last card
   */
  trySwitchToNextCard() {
    if (this.indexOfShownCard < this.studycardArray.length - 1) {
      this.cardToShow = getNextRandomizedCardFromStudykit(
        this.studycardArray,
        this.indexOfShownCard,
        this.indexRandomized
      );
      this.indexOfShownCard++;
    } else {
      this.redirectToHome();
    }
    this.resetShowAnswer();
  }

  /**
   * redirects to home route
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
   * resets every element, which contains answers
   */
  resetShowAnswer() {
    this.isShowAnswer = false;
    this.answerSimilarity = 0;
    this.answerOfTextarea = "";
    this.checkedMultipleAnswerIdArray = [];
  }

  /**
   * gives feedback of answer check
   */
  checkAnswer() {
    this.isShowAnswer = true;
    let isValide: boolean = false;
    if (this.cardToShow.type === "multiple") {
      isValide = this.checkMultipleAnswer();
    } else if (this.cardToShow.type === "text") {
      isValide = this.checkanswerOfTextarea();
    }
    this.handleResult(isValide);
  }

  /**
   * checks text answer
   * @returns { boolean } true if answer is higher than 70% similar to answer of card
   */
  checkanswerOfTextarea(): boolean {
    this.answerSimilarity =
      stringSimilarity.compareTwoStrings(
        this.answerOfTextarea,
        this.cardToShow.answers[0]
      ) * 100;
    this.answerSimilarity = parseFloat(this.answerSimilarity.toFixed(2));
    return this.answerSimilarity >= 70 ? true : false;
  }

  /**
   * checks all checkbox answers
   * @returns { boolean } true if all answers are right
   */
  checkMultipleAnswer(): boolean {
    let isRightList: boolean[] = this.cardToShow.answers.map((elem: Answer) =>
      this.isMultiplechoiceAnswerRight(elem)
    );
    return isRightList.every((elem: boolean) => elem === true);
  }

  /**
   * gives the user feedback if the answer(s) were correct
   * @param { boolean } isValide if answer(s) are right (true) or false
   */
  handleResult(isValide: boolean) {
    isValide ? this.processSuccess() : this.processFail();
  }

  /**
   * gives feedback, that the answers are correct, and updates in local Storage
   */
  processSuccess() {
    this.presentToast("bottom", "success", "Richtig beantwortet. Weiter so!");
    this.cardToShow.repetitionTimes++;
    this.updateCardProperties();
  }

   /**
   * gives feedback, that the answers are false, and updates in local Storage
   */
  processFail() {
    this.presentToast(
      "bottom",
      "danger",
      "Nicht richtig beantwortet. Beim nächsten Mal klappts besser!"
    );
    this.cardToShow.repetitionTimes = 0;
    this.updateCardProperties();
  }

  /**
   * updates studycard in local storages 
   */
  async updateCardProperties() {
    this.cardToShow.lastLearnedOn = new Date();
    let today = new Date();
    this.cardToShow.nextLearnDate.setDate(
      today.getDate() + this.getRepititionLearnDate()
    );
    await this.service.updateStudykit(this.studykit);
  }

  /**
   * @returns { number } after how many days a studycard should be learned again
   */
  getRepititionLearnDate(): number {
    switch (this.cardToShow.repetitionTimes) {
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

  /**
   * checks if multiple choice answer is correct
   * @param { Answer } answerElement 
   * @returns { boolean } true if multiplechoice answer is right  
   */
  isMultiplechoiceAnswerRight(answerElement: Answer): boolean {
    let isInAnswerCheckedList =
      this.checkIfAnswerIsInAnswerCheckedList(answerElement);

    if (!isInAnswerCheckedList && !answerElement.isRight) {
      return true;
    } else if (isInAnswerCheckedList && !answerElement.isRight) {
      return false;
    } else if (isInAnswerCheckedList && answerElement.isRight) {
      return true;
    } else if (!isInAnswerCheckedList && answerElement.isRight) {
      return false;
    }
  }

  /**
   * checks if an answer element is checked
   * @param { Answer } answerElement 
   * @returns { boolean } true if answer is checked
   */
  checkIfAnswerIsInAnswerCheckedList(answerElement: Answer): boolean {
    return this.checkedMultipleAnswerIdArray.filter(
      (value) => value === answerElement.id
    ).length > 0
      ? true
      : false;
  }

  /**
   * write/drop answer id to an array
   * @param { Answer } answer clicked answer
   */
  onChange(answer: Answer) {
    if (this.checkedMultipleAnswerIdArray.includes(answer.id)) {
      this.checkedMultipleAnswerIdArray =
        this.checkedMultipleAnswerIdArray.filter((value) => value != answer.id);
    } else {
      this.checkedMultipleAnswerIdArray.push(answer.id);
    }
  }

  /**
   * show toast
   * @param {string} position - "top" | "middle" | "bottom"
   * @param {string} color - "danger" | "warning" | "primary" | "light" | "success"
   * @param {string} msg - individual
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
