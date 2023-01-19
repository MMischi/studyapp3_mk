import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import { AuthService } from "src/app/services/auth/auth.service";
import { DbStudykitService } from "src/app/services/firestore/db-studykit.service";
import { DataService } from "src/app/services/localStorage/data.service";
import { Studykit } from "src/app/services/_interfaces/studykit";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"],
})
export class MenuPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dbService: DbStudykitService,
    private service: DataService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async logout() {
    this.authService.logout();
    this.router.navigateByUrl("login", { replaceUrl: true });
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
    const isSuccessful: boolean = await this.refreshStudykitCollection(
      dbSummary,
      localStorageSummary
    );

    if (isSuccessful === true)
      this.presentToast(
        "bottom",
        "success",
        "Lernsets erfolgreich aktualisiert."
      );
    else
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
  }

  async refreshStudykitCollection(
    array1Summary: number | (string | Studykit[])[],
    array2Summary: number | (string | Studykit[])[]
  ): Promise<boolean> {
    if (array1Summary[1].length > array2Summary[1].length) {
      return await this.handleRefresh(array1Summary, array2Summary);
    } else return await this.handleRefresh(array2Summary, array1Summary);
  }

  async handleRefresh(
    longerArraySummary: number | (string | Studykit[])[],
    shorterArraySummary: number | (string | Studykit[])[]
  ): Promise<boolean> {
    const longerArrayContent: Studykit[] = longerArraySummary[1];
    const shorterArrayContent: Studykit[] = shorterArraySummary[1];
    console.log(longerArrayContent);

    for (let i: number = 0; i < shorterArrayContent.length; i++) {
      const longerArrayIdx = longerArrayContent.findIndex(
        (elem: Studykit) => elem.id === shorterArrayContent[0].id
      );

      if (longerArrayIdx === -1) continue;
      else {
        const result = await this.checkUpdateSource(
          longerArraySummary,
          shorterArraySummary,
          longerArrayIdx,
          0
        );
        if (result === false) return false;
      }

      shorterArrayContent.splice(0, 1);
      longerArrayContent.splice(longerArrayIdx, 1);
    }

    return await this.storeNoExisting(
      shorterArraySummary[0],
      longerArrayContent
    );
  }

  async checkUpdateSource(
    longerArray: number | (string | Studykit[])[],
    shorterArray: number | (string | Studykit[])[],
    longerArrayIdx: number,
    shorterArrayIdx: number
  ): Promise<boolean> {
    const longerArrayOrigin: string = longerArray[0];
    const longerArrayContent: Studykit[] = longerArray[1];
    const shorterArrayOrigin: string = shorterArray[0];
    const shorterArrayContent: Studykit[] = shorterArray[1];

    if (
      shorterArrayContent[shorterArrayIdx].updated_at >
      longerArrayContent[longerArrayIdx].updated_at
    ) {
      return await this.handleUpdate(
        shorterArrayContent[shorterArrayIdx],
        shorterArrayOrigin
      );
    } else {
      return await this.handleUpdate(
        longerArrayContent[longerArrayIdx],
        longerArrayOrigin
      );
    }
  }

  async handleUpdate(
    contentToUpdate: Studykit,
    source: string
  ): Promise<boolean> {
    if (source === "firestore") {
      const result = await this.dbService.updateStudykitInDB(contentToUpdate);
      if (result === "failed") return false;
    } else if (source === "localStorage") {
      await this.service.updateStudykit(contentToUpdate);
    }
    return true;
  }

  async storeNoExisting(
    source: string,
    studykitArray: Studykit[]
  ): Promise<boolean> {
    for (let studykit of studykitArray) {
      if (source === "firestore") {
        const result = await this.dbService.storeStudykitToDB(studykit);
        if (result === "failed") return false;
      } else if (source === "localStorage") {
        await this.service.storeStudykit(studykit);
      }
    }

    return true;
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
