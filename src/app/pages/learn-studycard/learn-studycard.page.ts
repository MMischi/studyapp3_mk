import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
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
    private route: ActivatedRoute,
    private toastController: ToastController,
    private router: Router
  ) {}

  studycards: Card[] = [
    {
      id: "",
      lastLearnedOn: new Date(),
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

  indexOfUserCard: number = 0;
  cardIndex: number = 0;
  cardSortIndexes: number[] = [];
  cardToShow: Card = {
    id: "",
    lastLearnedOn: new Date(),
    repetitionTimes: 0,
    type: "",
    question: "",
    answers: [],
  };

  isShowAnswer: boolean = false;
  checkedAnswersId: String[] = [];

  ngOnInit() {}

  async ionViewWillEnter() {
    const routeParamStudykitId = this.route.snapshot.paramMap.get("id");
    if (routeParamStudykitId !== null) {
      this.studykit = await this.service.getStudykitById(routeParamStudykitId);
      this.cardSortIndexes = this.generateRandomNumber();
      this.cardIndex = this.cardSortIndexes[this.indexOfUserCard];
      this.cardToShow = this.studykit.cards[this.cardIndex];
    }

    this.isShowAnswer = false;
  }

  increaseCardIndex() {
    if (this.indexOfUserCard < this.studykit.cards.length - 1) {
      this.indexOfUserCard++;
      this.cardIndex = this.cardSortIndexes[this.indexOfUserCard];
      this.cardToShow = this.studykit.cards[this.cardIndex];
    } else {
      this.presentToast(
        "bottom",
        "success",
        "Du hast alle Lernkarten von diesem Set gelernt"
      );
      this.router.navigate(["/home"]);
    }

    this.isShowAnswer = false;
  }

  generateRandomNumber() {
    let arrayOfNumbersLengthStudykitCards: number[] = this.generateNumbers();
    return this.generateRandomSequence(arrayOfNumbersLengthStudykitCards);
  }
  generateNumbers(): number[] {
    let result: number[] = [];
    for (let i = 0; i < this.studykit.cards.length; i++) {
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
    if (this.cardToShow.type === 'multiple') {
      isValide = this.checkMultipleAnswer();
    }

    this.processResult(isValide);
  }

  checkMultipleAnswer(): boolean {
    let isRightList: boolean[] = this.cardToShow.answers.map((elem: Answer) => this.isChecked(elem));
    return isRightList.every((elem: boolean) => elem === true);
  }

  processResult(isValide: boolean) {
    isValide ? this.processSuccess() : this.processFail();
  }
  processSuccess() {
    this.presentToast("bottom", "success", "Richtig beantwortet. Weiter so!");
  }
  processFail() {
    this.presentToast("bottom", "danger", "Nicht richtig beantwortet. Beim nächsten Mal klappts besser!");
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
    return this.checkedAnswersId.filter((value) => value === answerElement.id)
      .length > 0
      ? true
      : false;
  }
  onChange(item: Answer) {
    if (this.checkedAnswersId.includes(item.id)) {
      this.checkedAnswersId = this.checkedAnswersId.filter(
        (value) => value != item.id
      );
    } else {
      this.checkedAnswersId.push(item.id);
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
