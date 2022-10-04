import { Component } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  slideOpts = {
    slidesPerView: 1.5,
    spaceBetween: 0,

    initialSlide: 1,
    centeredSlides: true,

    direction: "horizontal",
    speed: 400,
  };

  constructor() {}
}
