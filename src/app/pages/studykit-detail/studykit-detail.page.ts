import { Component, OnInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { ActivatedRoute } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { DbStudykitService } from "src/app/services/firestore/db-studykit.service";
import { UserService } from "src/app/services/user/user.service";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";
import { User } from "src/app/services/_interfaces/user";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-studykit-detail",
  templateUrl: "./studykit-detail.page.html",
  styleUrls: ["./studykit-detail.page.scss"],
})
export class StudykitDetailPage implements OnInit {
  constructor(
    private auth: Auth,
    private route: ActivatedRoute,
    private toastController: ToastController,

    private dbService: DbStudykitService,
    private userService: UserService
  ) {}

  userId: string;

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

    created_by: "",
    created_at: undefined,
    updated_at: undefined,
  };

  owner: User = {
    id: "",
    email: "",
    nickname: "",
    created_at: undefined,
    updated_at: undefined
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    this.userId = this.auth.currentUser.uid;
    const routeParamStudykitId = this.route.snapshot.paramMap.get("id");

    if (routeParamStudykitId !== null) {
      await this.getStudykit(routeParamStudykitId);
      await this.getOwner();
    }
  }

  async getStudykit(id: string) {
    const result = await this.dbService.getPublishedStudykitByIdFromDB(id);
    if (result === "failed") {
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
      return;
    }
    this.studykit = result;
  }

  async getOwner() {
    const result = await this.userService.getUserByIdFromDB(this.studykit.created_by);
    if (result === "failed" || result === null) {
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
      return;
    }
    this.owner = result;
  }

  async saveStudykit() {
    let studykitToStore = this.studykit;
    studykitToStore.id = uuidv4();
    studykitToStore.published = false;
    studykitToStore.created_by = this.auth.currentUser.uid;
    studykitToStore.created_at = new Date();
    studykitToStore.updated_at = new Date();

    console.log(studykitToStore);

    const result = await this.dbService.storeStudykitToDB(this.studykit);
    if (result === "failed") {
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
      return;
    }
    this.presentToast(
      "bottom",
      "success",
      "Das Lernset wurde erfolgreich gespeichert."
    );
  }

  /**
   * Shows toast
   * @param {string} position "top" | "middle" | "bottom"
   * @param {string} color "danger" | "warning" | "primary" | "light" | "success"
   * @param {string} msg individual
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
