import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import {
  getStudykitIdFromRout,
  randomizeStudycards,
} from "../../services/_utils/helper";
import { DataService } from "../..//services/data.service";

import { Card } from "../../services/_interfaces/card";
import { Studykit } from "../../services/_interfaces/studykit";

@Component({
  selector: "app-read-studycard",
  templateUrl: "./read-studycard.page.html",
  styleUrls: ["./read-studycard.page.scss"],
})
export class ReadStudycardPage implements OnInit {
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
  }

  /**
   * Show next card
   */
  increaseCardIndex() {
    if (this.cardIndex < this.studycardArray.length - 1) {
      this.cardIndex++;
      this.cardToShow = this.studycardArray[this.cardIndex];
    } else {
      this.presentToast("bottom", "success", "Du hast alle Lernkarten von diesem Set gelernt");
      this.router.navigate(['/home'])
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
