import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Studykit } from 'src/app/services/_interfaces/studykit';

@Component({
  selector: 'app-studykit-overview',
  templateUrl: './studykit-overview.page.html',
  styleUrls: ['./studykit-overview.page.scss'],
})
export class StudykitOverviewPage implements OnInit {

  constructor(private service: DataService) { }

  studykits: Studykit[] = this.service._testData; 

  ngOnInit() {
  }

}
