import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Studykit } from './_interfaces/studykit';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public _testData: Studykit[] = [];
  public _testStudykit: Studykit = {
    id: null,
    title: '',
    cards: [{
      id: null,
      lastLearnedOn: undefined,
      repetitionTimes: null,
      type: null,
      question: '',
      answers: [{
        id: '',
        text: '',
        isRight: undefined,
      }],
    }]
  };

  private DATA_STORAGE = 'studyapp_storage';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async getData() {
    return (await this.storage.get(this.DATA_STORAGE)) || [];
  }
}