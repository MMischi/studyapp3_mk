import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-studykit',
  templateUrl: './create-studykit.page.html',
  styleUrls: ['./create-studykit.page.scss'],
})
export class CreateStudykitPage implements OnInit {

  constructor() { }

  studycard_amount = 0;

  ngOnInit() {
  }

  addStudycard() {
    this.studycard_amount++;
    console.log(this.studycard_amount);
  }

}
