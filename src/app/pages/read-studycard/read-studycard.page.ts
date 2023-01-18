import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import {
  getStudykitIdFromRout,
  randomizeStudycards,
} from "../../services/_utils/helper";
import { DataService } from "src/app/services/localStorage/data.service";

import { Card } from "../../services/_interfaces/card";
import { Studykit } from "../../services/_interfaces/studykit";
import { Answer } from "src/app/services/_interfaces/answer";
import { Auth } from "@angular/fire/auth";

@Component({
  selector: "app-read-studycard",
  templateUrl: "./read-studycard.page.html",
  styleUrls: ["./read-studycard.page.scss"],
})
export class ReadStudycardPage implements OnInit {
  constructor(
    private auth: Auth,
    private service: DataService,

    private route: ActivatedRoute,
    private router: Router,
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

      created_by: "",
      created_at: undefined,
      updated_at: undefined,
    },
  ];
  studykit: Studykit = {
    id: "",
    title: "",
    description: "",
    cards: this.studycards,
    published: false,

    created_by: this.auth.currentUser.uid,
    created_at: undefined,
    updated_at: undefined,
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

    created_by: "",
    created_at: undefined,
    updated_at: undefined,
  }; // current shown card

  ngOnInit() {}

  async ionViewWillEnter() {
    const routeParam: string = getStudykitIdFromRout(this.route);
    if (routeParam !== null) {
      this.initLearning(routeParam);
    }
  }

  /* -------------------------------------- */
  /* init */
  /* -------------------------------------- */
  /**
   * Prepare studykit for learning
   */
  async initLearning(studykitId: string) {
    this.studykit = await this.service.getStudykitById(studykitId);
    this.studycardArray = randomizeStudycards(this.studykit.cards);
    this.cardToShow = this.studycardArray[this.cardIndex];

    console.log(this.cardToShow);
  }

  /**
   * Show next card
   */
  increaseCardIndex() {
    if (this.cardIndex < this.studycardArray.length - 1) {
      this.cardIndex++;
      this.cardToShow = this.studycardArray[this.cardIndex];
    } else {
      this.presentToast(
        "bottom",
        "success",
        "Du hast alle Lernkarten von diesem Set gelernt"
      );
      this.router.navigate(["/home"]);
    }
  }

  /**
   * Show previous card
   */
  decreaseCardIndex() {
    this.cardIndex--;
    this.cardToShow = this.studycardArray[this.cardIndex];
  }

  /**
   * Checks if there are right answers
   * @returns boolean
   */
  areThereRightAnswers(): boolean {
    const rightAnswers = this.cardToShow.answers.filter(
      (elem: Answer) => elem.isRight === false
    );
    return rightAnswers.length > 0;
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
