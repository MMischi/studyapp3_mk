import { Component, OnInit } from "@angular/core";

import { DbStudykitService } from "src/app/services/firestore/db-studykit.service";
import { DataService } from "src/app/services/localStorage/data.service";

import { Studykit } from "src/app/services/_interfaces/studykit";

@Component({
  selector: "app-studykit-overview",
  templateUrl: "./studykit-overview.page.html",
  styleUrls: ["./studykit-overview.page.scss"],
})
export class StudykitOverviewPage implements OnInit {
  constructor(
    private service: DataService,
    private dbService: DbStudykitService
  ) {}

  studykits: Studykit[] = [];

  ngOnInit() {}

  async ionViewWillEnter() {
    this.studykits = await this.service.getAllStudykits();
  }

  async deleteStudyset(studykitId: string) {
    await this.service.deleteStudykit(studykitId);
    if (navigator.onLine) this.dbService.deleteStudykitFromDB(studykitId);

    this.studykits = await this.service.getAllStudykits();
  }
}
