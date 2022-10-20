import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

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