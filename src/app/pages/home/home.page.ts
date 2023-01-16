import { Component } from "@angular/core";

import { DataService } from "src/app/services/localStorage/data.service";

import { Studykit } from "src/app/services/_interfaces/studykit";
import { Card } from "src/app/services/_interfaces/card";
import { ToastController } from "@ionic/angular";
import { DbStudykitService } from "src/app/services/firestore/db-studykit.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  slideOpts = {
    slidesPerView: 1.5,
    spaceBetween: -10,

    initialSlide: 1,
    centeredSlides: true,

    direction: "horizontal",
    speed: 400,
  };

  constructor(
    private service: DataService,
    private dbService: DbStudykitService,
    private toastController: ToastController
  ) {}

  studykit: Studykit;
  studykits: Studykit[] = [];

  async ngOnInit() {
    await this.tryRefreshStudykit();
  }

  async ionViewWillEnter() {
    this.studykits = await this.service.getAllStudykits();
  }

  compareWith(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  handleChange(ev) {
    this.studykit = ev.target.value;
  }

  isCardToLearn(studykit: Studykit) {
    const today = new Date();
    return (
      studykit.cards.filter(
        (elem: Card) =>
          elem.nextLearnDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)
      ).length > 0
    );
  }

  async tryRefreshStudykit() {
    const result = await this.dbService.getAllStudykitsFromDB();
    if (result === "failed") {
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
      return;
    }
    const dbStudykitArray = result;
    const localStorageStudykitArry = await this.service.getAllStudykits();

    if (dbStudykitArray === localStorageStudykitArry) return;

    const dbSummary = ["firestore", dbStudykitArray];
    const localStorageSummary = ["localStorage", localStorageStudykitArry];
    await this.refreshStudykitCollection(dbSummary, localStorageSummary);
  }

  async refreshStudykitCollection(
    array1Summary: number | (string | Studykit[])[],
    array2Summary: number | (string | Studykit[])[]
  ) {
    if (array1Summary[1].length > array2Summary[1].length)
      await this.handleRefresh(array1Summary, array2Summary);
    else await this.handleRefresh(array2Summary, array1Summary);
  }

  async handleRefresh(
    longerArraySummary: number | (string | Studykit[])[],
    shorterArraySummary: number | (string | Studykit[])[]
  ) {
    const longerArrayContent: Studykit[] = longerArraySummary[1];
    const shorterArrayContent: Studykit[] = shorterArraySummary[1];

    for (let i: number = 0; i < shorterArrayContent.length; i++) {
      const longerArrayIdx = longerArrayContent.findIndex(
        (elem: Studykit) => elem.id === shorterArrayContent[0].id
      );

      if (longerArrayIdx === -1) continue;
      else
        await this.checkUpdateSource(
          longerArraySummary,
          shorterArraySummary,
          longerArrayIdx,
          0
        );

      shorterArrayContent.splice(0, 1);
      longerArrayContent.splice(longerArrayIdx, 1);
    }

    await this.storeNoExisting(shorterArraySummary[0], longerArrayContent);
  }

  async checkUpdateSource(
    longerArray: number | (string | Studykit[])[],
    shorterArray: number | (string | Studykit[])[],
    longerArrayIdx: number,
    shorterArrayIdx: number
  ) {
    const longerArrayOrigin: string = longerArray[0];
    const longerArrayContent: Studykit[] = longerArray[1];
    const shorterArrayOrigin: string = shorterArray[0];
    const shorterArrayContent: Studykit[] = shorterArray[1];

    if (
      shorterArrayContent[shorterArrayIdx].updated_at >
      longerArrayContent[longerArrayIdx].updated_at
    ) {
      await this.handleUpdate(
        shorterArrayContent[shorterArrayIdx],
        shorterArrayOrigin
      );
    } else {
      await this.handleUpdate(
        longerArrayContent[longerArrayIdx],
        longerArrayOrigin
      );
    }
  }

  async handleUpdate(contentToUpdate: Studykit, source: string) {
    if (source === "firestore") {
      await this.dbService.updateStudykitInDB(contentToUpdate);
    } else if (source === "localStorage") {
      await this.service.updateStudykit(contentToUpdate);
    }
  }

  async storeNoExisting(source: string, studykitArray: Studykit[]) {
    studykitArray.forEach(async (elem: Studykit) => {
      if (source === "firestore") {
        await this.dbService.storeStudykitToDB(elem);
      } else if (source === "localStorage") {
        this.service.storeStudykit(elem);
      }
    });
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
