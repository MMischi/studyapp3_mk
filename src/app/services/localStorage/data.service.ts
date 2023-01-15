import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage-angular";
import { Card } from "./_interfaces/card";
import { Studykit } from "./_interfaces/studykit";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private STUDYKIT_DATA_STORAGE = "studykits";

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  /**
   * retruns data from local storage by key
   *
   * @param {string} key - name of storage key
   * @returns content of storage in key or empty array
   */
  async getData(key: string) {
    return (await this.storage.get(key)) || [];
  }

  // local storage: studykit endpoints
  /**
   * get all saved studykits
   * @returns Promise<Studykit[]>
   */
  async getAllStudykits(): Promise<Studykit[]> {
    return this.getData(this.STUDYKIT_DATA_STORAGE);
  }

  /**
   * get one studykit by id
   * @param {string} studykitId - id of studykit
   * @returns Promise<Studykit>
   */
  async getStudykitById(studykitId: string): Promise<Studykit> {
    let allStudykits = await this.getAllStudykits();
    return allStudykits.filter((elem: Studykit) => elem.id === studykitId)[0];
  }

  /**
   * store one studykit to local storage
   * @param {Studykit} studykit
   */
  async storeStudykit(studykit: Studykit) {
    let allStudykits = await this.getAllStudykits();
    allStudykits.push(studykit);
    await this.saveStudykits(allStudykits);
  }

  /**
   * delete studykit by id
   * @param {string} studykitId - id of studykit
   */
  async deleteStudykit(studykitId: string) {
    let allStudykits = await this.getAllStudykits();
    let indexOfStudykit = allStudykits.findIndex(
      (elem: Studykit) => elem.id === studykitId
    );
    allStudykits.splice(indexOfStudykit, 1);
    this.saveStudykits(allStudykits);
  }

  /**
   * update a studykit
   * @param {Studykit} studykit - full studykit
   */
  async updateStudykit(studykit: Studykit) {
    let allStudykits = await this.getAllStudykits();
    let indexOfStudykit = allStudykits.findIndex(
      (elem: Studykit) => elem.id === studykit.id
    );
    allStudykits[indexOfStudykit] = studykit;
    this.saveStudykits(allStudykits);
  }

  /**
   * save all studykits
   * @param studykits
   */
  async saveStudykits(studykits: Studykit[]) {
    this.storage.set(this.STUDYKIT_DATA_STORAGE, studykits);
  }

  /**
   * updates card in studykit by id
   * @param { string } studykitId
   * @param { Card } card
   */
  async updateCardInStudykit(studykitId: string, card: Card) {
    let allStudykits = await this.getAllStudykits();
    let indexOfStudykit = allStudykits.findIndex(
      (elem: Studykit) => elem.id === studykitId
    );
    let indexOfCard = allStudykits[indexOfStudykit].cards.findIndex(
      (elem: Card) => elem.id === card.id
    );
    allStudykits[indexOfStudykit].cards[indexOfCard] = card;
    this.saveStudykits(allStudykits);
  }
}
