import { Component, OnInit } from "@angular/core";
import { Card } from "src/app/services/_interfaces/card";

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: "app-create-studykit",
  templateUrl: "./create-studykit.page.html",
  styleUrls: ["./create-studykit.page.scss"],
})
export class CreateStudykitPage implements OnInit {
  constructor() {}

  cardType: string = "";
  studycards: Card[] = [];

  ngOnInit() { }

  addStudycard() {
    let card: Card = {
      id: uuidv4(),
      lastLearnedOn: new Date(),
      repetitionTimes: 0,
      type: "",
      question: "",
      answers: []
    };
    this.studycards.push(card);
  }

  handleChange(ev, studycard_id) {
    const index = this.studycards.findIndex(item => item.id === studycard_id);
    this.studycards[index].type = ev.target.value;
  }

  checkCondition(index) {
    let card_info = this.cardType.split('_');
    return card_info[0] == "text" && card_info[1] == index;
  }
}
