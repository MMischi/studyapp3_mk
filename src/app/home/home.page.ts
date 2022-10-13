import { Component } from "@angular/core";

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

  constructor() {}

  learningKit = [];
  learningKits = [
    {
      id: 1,
      name: 'Geschichte',
    },
    {
      id: 2,
      name: 'Informatik',
    },
    {
      id: 3,
      name: 'Marketing',
    },
  ];

  ngOnInit() {
    console.log(this.learningKit);
  }

  compareWith(o1, o2) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

  handleChange(ev) {
    this.learningKit = ev.target.value;
  }
}
