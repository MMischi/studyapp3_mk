import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
  constructor(private service: DataService, private route: ActivatedRoute) {}

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
    this.indexOfUserCard++;
    this.cardIndex = this.cardSortIndexes[this.indexOfUserCard];
    this.cardToShow = this.studykit.cards[this.cardIndex];

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
  }

  isChecked(answerElement: Answer): boolean {
    let isInAnswerCheckedList = this.checkIfAnswerIsInAnswerCheckedList(answerElement);

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

}
