import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { Answer } from "src/app/services/_interfaces/answer";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

import { AlertController, ToastController } from "@ionic/angular";

import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-create-studykit",
  templateUrl: "./create-studykit.page.html",
  styleUrls: ["./create-studykit.page.scss"],
})
export class CreateStudykitPage implements OnInit {
  constructor(
    private service: DataService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  errorMsgContent: string = "";
  delCardId: string = "";
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

  requestDeleteCard(card_id: string) {
    this.delCardId = card_id;

    this.presentAlert(
      "Lernkarte löschen",
      "Möchtest du die Lernkarte wirklich löschen?",
      "Abbrechen",
      "Löschen",
      null,
      this.deleteCard
    );
  }

  deleteCard() {
    this.studycards.splice(
      this.studycards.map((elem) => elem.id).indexOf(this.delCardId),
      1
    );
  }

  deleteAnswerEntry(card_id: string, answer_id: string) {
    this.studycards
      .filter((elem) => elem.id === card_id)[0]
      .answers.splice(
        this.studycards
          .filter((elem) => elem.id === card_id)[0]
          .answers.map((elem) => elem.id)
          .indexOf(answer_id),
        1
      );
  }

  setFocusOnLastElement() {
    let answersBox = document.getElementById("answers-box");
    let lastIonItem = answersBox.lastElementChild;
    let ionInput = lastIonItem.getElementsByClassName(
      "native-input"
    )[0] as HTMLElement;

    console.log(ionInput);

    ionInput.focus();
  }

  isStudykitValide(): boolean {
    if (!this.hasTitleSet()) {
      this.presentToast(
        "bottom",
        "danger",
        "Benenne dein Lernset vor dem Speichern."
      );
      return false;
    } else if (!this.areCardsComplete()) {
      this.presentAlert(
        "Lernset nicht vollständig!",
        `Bei einer erstellten Lernkarte ${this.errorMsgContent}. Möchtest du das Lernset so speichern?`,
        "Lernset überarbeiten",
        "Lernset speichern",
        null,
        this.saveStudykit
      );
    } else {
      this.saveStudykit();
    }
  }
  hasTitleSet(): boolean {
    return this.studykit.title !== "";
  }
  hasTypeSet(): boolean {
    if (this.studykit.cards.filter((elem) => elem.type === "").length > 0) {
      this.errorMsgContent += "ist nicht die Art der Frage angegeben";
      return false;
    } else {
      return true;
    }
  }
  hasAllQuestionsSet() {
    if (this.studykit.cards.filter((elem) => elem.question === "").length > 0) {
      this.errorMsgContent += "ist keine Frage vorhanden";
      return false;
    } else {
      return true;
    }
  }
  hasAllAnswer() {
    let hasText: number = 0;
    let isError: boolean;

    for (let card of this.studykit.cards) {
      for (let answer of card.answers) {
        if (answer.text !== "") {
          hasText++;
        }
      }

      if (hasText > 0) {
        isError = false;
        hasText = 0;
      } else {
        isError = true;
        hasText = 0;
        break;
      }
    }

    if (isError === true) {
      this.errorMsgContent += "sind keine Antworten enthalten";
      return false;
    } else {
      return true;
    }
  }

  areCardsComplete() {
    if (this.hasTypeSet() && this.hasAllQuestionsSet() && this.hasAllAnswer()) {
      return true;
    } else {
      false;
    }
  }

  saveStudykit() {
    this.service._testData.push(this.studykit);
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

  async presentAlert(
    header: string,
    msg: string,
    opt1: string,
    opt2: string,
    func1,
    func2
  ) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: opt1,
          handler: () => {
            if (func1 !== null) { func1(); }
          },
        },
        {
          text: opt2,
          handler: () => {
            if (func2 !== null) { func2(); }
          },
        },
      ],
    });

    await alert.present();
  }
}
