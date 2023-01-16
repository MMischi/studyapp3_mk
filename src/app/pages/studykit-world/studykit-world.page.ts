import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { DbStudykitService } from "src/app/services/firestore/db-studykit.service";
import { Studykit } from "src/app/services/_interfaces/studykit";

@Component({
  selector: "app-studykit-world",
  templateUrl: "./studykit-world.page.html",
  styleUrls: ["./studykit-world.page.scss"],
})
export class StudykitWorldPage implements OnInit {
  constructor(
    private toastController: ToastController,
    private dbService: DbStudykitService
  ) {
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    window.addEventListener("online", () => {
      this.isOnline = true;
    });
  }

  isOnline: boolean;
  studykitArray: Studykit[] = [];
  results: Studykit[] = [...this.studykitArray];

  ngOnInit() {
    this.isOnline = navigator.onLine;
  }

  async ionViewWillEnter() {
    if (!this.isOnline) {
      this.presentToast(
        "bottom",
        "warning",
        "Es besteht keine Internetverbindung."
      );
      return;
    }
    await this.getStudykitData();
  }

  async getStudykitData() {
    const result = await this.dbService.getAllPublishedStudykitFromAllUsers();
    if (result === "failed") {
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
      return;
    } else {
      this.studykitArray = result;
      this.results = this.studykitArray;
      console.log(this.results);
    }
  }

  handleSearchbarChange(event) {
    const query = event.target.value.toLowerCase();
    this.results = this.studykitArray.filter(
      (elem: Studykit) => elem.title.toLowerCase().indexOf(query) > -1
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
}
