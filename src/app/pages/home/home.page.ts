import { Component } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { Studykit } from "src/app/services/_interfaces/studykit";

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

  constructor(private service: DataService) {}

  studykit: Studykit;
  studykits: Studykit[] = [];

  ngOnInit() { }

  async ionViewWillEnter() {
    this.studykits = await this.service.getAllStudykits();
  }

  compareWith(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  handleChange(ev) {
    this.studykit = ev.target.value;
  }
}
