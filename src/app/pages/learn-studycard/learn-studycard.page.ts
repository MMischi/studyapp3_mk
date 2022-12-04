import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

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
    const routeParamStudykitId = getStudysetIdFromRout(this.route);
    if (routeParamStudykitId !== null) {
      this.studykit = await this.service.getStudykitById(routeParamStudykitId);
      this.studycardsToShow = this.studykit.cards.filter((card: Card) => card.nextLearnDate <= new Date());
      this.indexRandomized = this.generateRandomNumber();
      this.indexFromRandomizedCardSet =
        this.indexRandomized[this.indexOfShownCard];
      this.cardToShow = this.studycardArray[this.indexFromRandomizedCardSet];
    }

    this.isShowAnswer = false;
  }

  increaseIndexFromRandomizedCardSet() {
    if (this.indexOfShownCard < this.studycardArray.length - 1) {
      this.indexOfShownCard++;
      this.indexFromRandomizedCardSet =
        this.indexRandomized[this.indexOfShownCard];
      this.cardToShow = this.studycardArray[this.indexFromRandomizedCardSet];
    } else {
      this.presentToast(
        "bottom",
        "success",
        "Du hast alle Lernkarten von diesem Set gelernt"
      );
      this.router.navigate(["/home"]);
    }

    this.answerOfTextarea = "";
    this.isShowAnswer = false;
  }

  generateRandomNumber() {
    let arrayOfNumbersLengthStudykitCards: number[] = this.generateNumbers();
    return this.generateRandomSequence(arrayOfNumbersLengthStudykitCards);
  }
  generateNumbers(): number[] {
    let result: number[] = [];
    for (let i = 0; i < this.studycardArray.length; i++) {
      result.push(i);
    }
    return result;
  }
  generateRandomSequence(array: number[]): number[] {
    let arrayToRandomize: number[] = array;
    let result: number[] = [];

    while (arrayToRandomize.length !== 0) {
      let index = Math.floor(Math.random() * arrayToRandomize.length);
      result.push(arrayToRandomize[index]);
      arrayToRandomize.splice(index, 1);
    }

    return result;
  }

  checkAnswer() {
    this.isShowAnswer = true;
    let isValide: boolean = false;
    if (this.cardToShow.type === "multiple") {
      isValide = this.checkMultipleAnswer();
    } else if (this.cardToShow.type === "text") {
      isValide = this.checkanswerOfTextarea();
    }

    this.processResult(isValide);
  }

  checkanswerOfTextarea(): boolean {
    this.answerSimilarity =
      stringSimilarity.compareTwoStrings(
        this.answerOfTextarea,
        this.cardToShow.answers[0]
      ) * 100;
    this.answerSimilarity = parseFloat(this.answerSimilarity.toFixed(2));
    return this.answerSimilarity >= 70 ? true : false;
  }

  checkMultipleAnswer(): boolean {
    let isRightList: boolean[] = this.cardToShow.answers.map((elem: Answer) =>
      this.isChecked(elem)
    );
    return isRightList.every((elem: boolean) => elem === true);
  }

  processResult(isValide: boolean) {
    isValide ? this.processSuccess() : this.processFail();
  }
  processSuccess() {
    this.presentToast("bottom", "success", "Richtig beantwortet. Weiter so!");
    this.cardToShow.repetitionTimes++;
    this.updateCardProperties();
  }
  processFail() {
    this.presentToast(
      "bottom",
      "danger",
      "Nicht richtig beantwortet. Beim nächsten Mal klappts besser!"
    );
    this.cardToShow.repetitionTimes = 0;
    this.updateCardProperties();
  }
  updateCardProperties() {
    console.log(this.cardToShow);
    this.cardToShow.lastLearnedOn = new Date();
    let today = new Date();
    this.cardToShow.nextLearnDate.setDate(
      today.getDate() + this.getRepititionLearnDate()
    );
    this.service.updateStudykit(this.studykit);
  }
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

  isChecked(answerElement: Answer): boolean {
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
  checkIfAnswerIsInAnswerCheckedList(answerElement: Answer) {
    return this.checkedMultipleAnswerIdArray.filter(
      (value) => value === answerElement.id
    ).length > 0
      ? true
      : false;
  }
  onChange(item: Answer) {
    if (this.checkedMultipleAnswerIdArray.includes(item.id)) {
      this.checkedMultipleAnswerIdArray =
        this.checkedMultipleAnswerIdArray.filter((value) => value != item.id);
    } else {
      this.checkedMultipleAnswerIdArray.push(item.id);
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
