import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { Answer } from "src/app/services/_interfaces/answer";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

import { ToastController } from "@ionic/angular";

import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-create-studykit",
  templateUrl: "./create-studykit.page.html",
  styleUrls: ["./create-studykit.page.scss"],
})
export class CreateStudykitPage implements OnInit {
  constructor(
    private service: DataService,
    private toastController: ToastController
  ) {}

  cardType: string = "";
  studycards: Card[] = [
    {
      id: uuidv4(),
      lastLearnedOn: new Date(),
      repetitionTimes: 0,
      type: "",
      question: "",
      answers: [],
    },
  ];
  studykit: Studykit = {
    id: uuidv4(),
    title: "",
    cards: this.studycards,
  };

  ngOnInit() {}

  addStudycard() {
    let card: Card = {
      id: uuidv4(),
      lastLearnedOn: new Date(),
      repetitionTimes: 0,
      type: "",
      question: "",
      answers: [],
    };
    this.studycards.push(card);
  }

  handleChange(ev, studycard_id) {
    const index = this.studycards.findIndex((item) => item.id === studycard_id);
    this.studycards[index].type = ev.target.value;

    if (ev.target.value == "multiple") {
      this.newAnswer(studycard_id);
    }
  }

  checkCondition(index) {
    let card_info = this.cardType.split("_");
    return card_info[0] == "text" && card_info[1] == index;
  }

  newAnswer(studycard_id: String) {
    const index = this.studycards.findIndex((item) => item.id === studycard_id);

    let answer: Answer = {
      id: uuidv4(),
      text: "",
      isRight: false,
    };

    this.studycards[index].answers.push(answer);
    setTimeout(this.setFocusOnLastElement, 0);
  }

  setFocusOnLastElement() {
    let answersBox = document.getElementById("answers-box");
    let lastIonItem = answersBox.lastElementChild;
    let input =
      (lastIonItem.lastElementChild.getElementsByTagName(
        "input"
      )[0] as HTMLElement) || null;

    input.focus();
  }

  saveStudykit() {
    console.log(this.studykit);
    let isKitValide = this.isStudykitValide();

    console.log("isKitValide: " + isKitValide);

    if (isKitValide == true) {
      this.service._testData.push(this.studykit);
    }
  }

  isStudykitValide(): boolean {
    if (this.checkIfTitle() && this.checkCards()) {
      return true;
    } else {
      return false;
    }
  }

  checkIfTitle(): boolean {
    if (this.studykit.title !== "") {
      return true;
    } else {
      this.presentToast("bottom", "light", "Kein Titel vorhanden.");
      return false;
    }
  }

  checkCards() {
    // this.checkIfQuestion();
    // this.checkIfType();
    // this.checkIfMinAnswer();

    return true;
  }

  async presentToast(
    position: "top" | "middle" | "bottom",
    color: "danger" | "warning" | "primary" | "light",
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
