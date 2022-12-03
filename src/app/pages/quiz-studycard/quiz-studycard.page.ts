import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { Answer } from "src/app/services/_interfaces/answer";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

import stringSimilarity from "../../../../node_modules/string-similarity";

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

  indexOfUserCard: number = 0;
  cardIndex: number = 0;
  cardSortIndexes: number[] = [];
  cardToShow: Card = {
    id: "",
    lastLearnedOn: new Date(),
    nextLearnDate: new Date(),
    repetitionTimes: 0,
    type: "",
    question: "",
    answers: [],
  };

  textAnswer: String = "";
  answerSimilarity: Number = 0;
  checkedAnswersId: String[] = [];

  arrayOfIsRight: boolean[] = [];
  arrayOfWrongCards: Card[] = [];

  constructor(private service: DataService, private route: ActivatedRoute) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    const routeParamStudykitId = this.route.snapshot.paramMap.get("id");
    if (routeParamStudykitId !== null) {
      this.studykit = await this.service.getStudykitById(routeParamStudykitId);
      this.cardSortIndexes = this.generateRandomNumber();
      this.cardIndex = this.cardSortIndexes[this.indexOfUserCard];
      this.cardToShow = this.studykit.cards[this.cardIndex];
    }

    console.log(this.cardToShow);
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

  increaseCardIndex() {
    if (this.indexOfUserCard < this.studykit.cards.length - 1) {
      this.indexOfUserCard++;
      this.cardIndex = this.cardSortIndexes[this.indexOfUserCard];
      this.cardToShow = this.studykit.cards[this.cardIndex];
    } else if (this.indexOfUserCard < this.studykit.cards.length) {
      console.log(this.arrayOfIsRight);
    }

    this.textAnswer = "";
  }

  checkAnswer() {
    let isValide: boolean = false;
    if (this.cardToShow.type === 'multiple') {
      isValide = this.checkMultipleAnswer();
    } else if (this.cardToShow.type === 'text') {
      isValide = this.checkTextAnswer();
    }

    this.rememberAnswers(isValide);
    this.increaseCardIndex();
  }

  checkTextAnswer(): boolean {
    this.answerSimilarity = stringSimilarity.compareTwoStrings(this.textAnswer, this.cardToShow.answers[0]) * 100;
    this.answerSimilarity = parseFloat(this.answerSimilarity.toFixed(2));
    return this.answerSimilarity >= 70 ? true : false;
  }

  checkMultipleAnswer(): boolean {
    let isRightList: boolean[] = this.cardToShow.answers.map((elem: Answer) => this.isChecked(elem));
    return isRightList.every((elem: boolean) => elem === true);
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

  rememberAnswers(answerIsValide: boolean) {
    this.arrayOfIsRight.push(answerIsValide);

    if (answerIsValide) {
      this.arrayOfWrongCards.push(this.cardToShow);
    }
  }
}
