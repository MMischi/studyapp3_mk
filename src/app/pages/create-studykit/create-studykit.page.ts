import { Component, Inject, OnInit } from "@angular/core";
import { v4 as uuidv4 } from "uuid";

import { DbStudykitService } from "src/app/services/firestore/db-studykit.service";
import { DataService } from "src/app/services/localStorage/data.service";
import { Answer } from "src/app/services/_interfaces/answer";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

import { AlertController, ToastController } from "@ionic/angular";

import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { Auth } from "@angular/fire/auth";

@Component({
  selector: "app-create-studykit",
  templateUrl: "./create-studykit.page.html",
  styleUrls: ["./create-studykit.page.scss"],
})
export class CreateStudykitPage implements OnInit {
  constructor(
    private auth: Auth,
    private service: DataService,
    private dbService: DbStudykitService,

    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  isStudikitEdited: boolean = false;
  errorMsgContent: string = "";
  delCardId: string = "";
  cardType: string = "";

  studycards: Card[] = [
    {
      id: uuidv4(),
      lastLearnedOn: new Date(),
      nextLearnDate: new Date(),
      repetitionTimes: 0,
      type: "",
      question: "",
      answers: [],

      created_by: this.auth.currentUser.uid,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]; // element to show at the beginning

  studykit: Studykit = {
    id: uuidv4(),
    title: "",
    description: "",
    cards: this.studycards,
    published: false,

    created_by: this.auth.currentUser.uid,
    created_at: new Date(),
    updated_at: new Date(),
  }; // element to show at the beginning

  ngOnInit() {
    const routeParamStudykitId = this.route.snapshot.paramMap.get("id");

    if (routeParamStudykitId !== null) {
      this.isStudikitEdited = true;
      this.setStudykitValues(routeParamStudykitId);
    }
  }

  /**
   * Sets values for studykit (title and cards) by studykit id
   * @param {string} studykitId - id of studyset
   */
  async setStudykitValues(studykitId: string) {
    this.studykit = await this.service.getStudykitById(studykitId);
    this.studycards = this.studykit.cards;
  }

  /**
   * add empty studycard to current used studycards
   */
  addStudycard() {
    let card: Card = {
      id: uuidv4(),
      lastLearnedOn: new Date(),
      nextLearnDate: new Date(),
      repetitionTimes: 0,
      type: "",
      question: "",
      answers: [],

      created_by: this.auth.currentUser.uid,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.studycards.push(card);
  }

  /**
   * updates publish state
   * @param e click event
   */
  updatePublishState(e) {
    this.studykit.published = e.detail.checked;
  }

  /**
   * set studycard type by studycard-id. If multiple is set an answer will be created.
   * @param {any} ev - given event (clickevent)
   * @param {string} studycardId - id of studycard
   */
  setCardType(ev: any, studycardId: string) {
    const index = this.studycards.findIndex((item) => item.id === studycardId);
    this.studycards[index].type = ev.target.value;

    if (ev.target.value == "multiple") {
      this.addNewAnswer(studycardId);
    }
  }

  /**
   * add new answer to studycard
   * @param {string} studycardId - id of studycard
   */
  addNewAnswer(studycardId: String) {
    const index = this.studycards.findIndex((item) => item.id === studycardId);
    let answer: Answer = {
      id: uuidv4(),
      text: "",
      isRight: false,

      created_by: this.auth.currentUser.uid,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.studycards[index].answers.push(answer);
    setTimeout(this.setFocusOnLastElement, 0);
  }

  /**
   * calls dialog to confirme delete card
   * @param {string} cardId - id of studycard
   */
  requestDeleteCard(cardId: string) {
    this.delCardId = cardId;

    this.presentAlert(
      "Lernkarte löschen",
      "Möchtest du die Lernkarte wirklich löschen?",
      "Abbrechen",
      "Löschen",
      null,
      "deleteCard"
    );
  }

  /**
   * delete card by studycard-id (id has to be set at this.delCardId)
   */
  deleteCard() {
    this.studycards.splice(
      this.studycards.map((elem) => elem.id).indexOf(this.delCardId),
      1
    );
  }

  /**
   * delete answer by id from studycard-id
   * @param {string} cardId - id of card
   * @param {string} answerId - id of answer
   */
  deleteAnswerEntry(cardId: string, answerId: string) {
    this.studycards
      .filter((elem) => elem.id === cardId)[0]
      .answers.splice(
        this.studycards
          .filter((elem) => elem.id === cardId)[0]
          .answers.map((elem) => elem.id)
          .indexOf(answerId),
        1
      );
  }

  /**
   * set element focuse on latest answer element
   */
  setFocusOnLastElement() {
    let answersBox = document.getElementById("answers-box");
    let lastIonItem = answersBox.lastElementChild;
    let ionInput = lastIonItem.getElementsByClassName(
      "native-input"
    )[0] as HTMLElement;

    ionInput.focus();
  }

  /**
   * checks if studykit is valide and save it or display error
   */
  handleStudykitSaving() {
    if (!this.hasTitle()) {
      this.presentToast(
        "bottom",
        "danger",
        "Benenne dein Lernset vor dem Speichern."
      );
    } else if (!this.areCardsComplete()) {
      this.presentAlert(
        "Lernset nicht vollständig!",
        `Bei einer erstellten Lernkarte ${this.errorMsgContent}. Möchtest du das Lernset so speichern?`,
        "Lernset überarbeiten",
        "Lernset speichern",
        null,
        "saveKit"
      );
    } else {
      this.saveOrUpdateStudykit();
    }
  }

  /**
   * checks if studykit has title
   * @returns boolean
   */
  hasTitle(): boolean {
    return this.studykit.title !== "";
  }

  /**
   * checks if card type is everywhere present
   * @returns boolean
   */
  hasType(): boolean {
    if (this.studykit.cards.filter((elem) => elem.type === "").length > 0) {
      this.errorMsgContent += "ist nicht die Art der Frage angegeben";
      return false;
    } else {
      return true;
    }
  }

  /**
   * checks if question is everywhere present
   * @returns boolean
   */
  hasAllQuestions() {
    if (this.studykit.cards.filter((elem) => elem.question === "").length > 0) {
      this.errorMsgContent += "ist keine Frage vorhanden";
      return false;
    } else {
      return true;
    }
  }

  /**
   * checks if answer(s) is/are everywhere present
   * @returns boolean
   */
  hasAllAnswer(): boolean {
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

  /**
   * checks is all values of every studycard is set
   * @returns
   */
  areCardsComplete(): boolean {
    if (this.hasType() && this.hasAllQuestions() && this.hasAllAnswer()) {
      return true;
    } else {
      false;
    }
  }

  /**
   * saves studykit
   */
  async saveOrUpdateStudykit() {
    if (!this.isStudikitEdited) {
      this.handleSave();
    } else if (this.isStudikitEdited) {
      await this.handleUpdate();
    }
    this.router.navigate(["/home"]);
    this.presentToast("bottom", "success", "Lernset wurde gespeichert.");
  }

  /**
   * handle save studykit
   */
  async handleSave() {
    this.deleteCardsWithEmptyQuestion();
    this.storeStudykitToLocalStorage();
    if (navigator.onLine) await this.storeStudykitToDB();
  }

  /**
   * drops empty studycards
   */
  deleteCardsWithEmptyQuestion() {
    let emptyCardsIds: number[] = [];
    for(let i = 0; i < this.studykit.cards.length; i++) {
      if(this.studykit.cards[i].question === '') emptyCardsIds.push(i);
    }

    emptyCardsIds.forEach((elem: number) => {
      this.studykit.cards.splice(elem,1);
    })
  }

  /**
   * stores studykit data to local storage
   */
  async storeStudykitToLocalStorage() {
    await this.service.storeStudykit(this.studykit);
  }

  /**
   * stores studykit data to database
   */
  async storeStudykitToDB() {
    const result = await this.dbService.storeStudykitToDB(this.studykit);
    if (result === "failed")
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
  }

  async handleUpdate() {
    this.studykit.updated_at = new Date();

    await this.updateStudykitInLocalStorage();
    if (navigator.onLine) await this.updateStudykitInDB();
  }

  /**
   * updates studykit data in local storage
   */
  async updateStudykitInLocalStorage() {
    await this.service.updateStudykit(this.studykit);
  }

  /**
   * updates studykit data in database
   */
  async updateStudykitInDB() {
    const result = await this.dbService.updateStudykitInDB(this.studykit);
    if (result === "failed")
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
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

  /**
   * show modal/dialog
   * @param {string} header - individual
   * @param {string} msg - individual
   * @param {string} optionText1 - individual
   * @param {string} optionText2 - individual
   * @param {string} funcName1 - function which is called at option 1 (may need to be added)
   * @param {string} funcName2 - function which is called at option 2 (may need to be added)
   */
  async presentAlert(
    header: string,
    msg: string,
    optionText1: string,
    optionText2: string,
    funcName1: string,
    funcName2: string
  ) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: [
        {
          text: optionText1,
          handler: () => {
            switch (funcName1) {
              case "saveKit":
                this.saveOrUpdateStudykit();
                break;
              case "deleteCard":
                this.deleteCard();
                break;
            }
          },
        },
        {
          text: optionText2,
          handler: () => {
            switch (funcName2) {
              case "saveKit":
                this.saveOrUpdateStudykit();
                break;
              case "deleteCard":
                this.deleteCard();
                break;
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
