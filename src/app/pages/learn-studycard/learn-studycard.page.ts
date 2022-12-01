import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { Card } from "src/app/services/_interfaces/card";
import { Studykit } from "src/app/services/_interfaces/studykit";

@Component({
  selector: "app-learn-studycard",
  templateUrl: "./learn-studycard.page.html",
  styleUrls: ["./learn-studycard.page.scss"],
})
export class LearnStudycardPage implements OnInit {
  constructor(private service: DataService, private route: ActivatedRoute) {}

  studycards: Card[] = [
    {
      id: "",
      lastLearnedOn: new Date(),
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
  cardToShow: Card = {
    id: "",
    lastLearnedOn: new Date(),
    repetitionTimes: 0,
    type: "",
    question: "",
    answers: [],
  };

  ngOnInit() {}

  async ionViewWillEnter() {
    const routeParamStudykitId = this.route.snapshot.paramMap.get("id");
    if (routeParamStudykitId !== null) {
      this.studykit = await this.service.getStudykitById(routeParamStudykitId);
      this.cardToShow = this.studykit.cards[0];
    }
  }
}
