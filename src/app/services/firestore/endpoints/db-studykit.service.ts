import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
} from "@angular/fire/firestore";

import { Studykit } from "../../_interfaces/studykit";
import { Card } from "../../_interfaces/card";

@Injectable({
  providedIn: "root",
})
export class DbStudykitService {
  private STUDYKIT_DATA_STORAGE = "studykits";

  constructor(private firestore: Firestore) {}

  /**
   * creates reference to collection
   * @returns full studykit collection
   */
  getCollection() {
    return collection(this.firestore, this.STUDYKIT_DATA_STORAGE);
  }

  getStudykitByIdFromDb(id: string) {
    return doc(this.firestore, `${this.STUDYKIT_DATA_STORAGE}/${id}`);
  }

  /**
   * retruns studykits from db
   *
   * @returns content of studykit storage
   */
  async getAllStudykitsFromDB(): Promise<Studykit[]> {
    const docsRef = await getDocs(this.getCollection());

    let studykitArray: Studykit[] = [];
    docsRef.forEach((doc) => studykitArray.push(doc.data() as Studykit));

    return studykitArray;
  }

  /**
   * store studykit to db
   */
  storeStudykitDB(studykit: Studykit) {
    addDoc(this.getStudykitCollection(), studykit);
  }

  /**
   * delete studykit by id from db
   * @param {string} studykitId - id of studykit
   */
  async deleteStudykit(studykitId: string) {
    deleteDoc(this.getStudykitByIdFromDb(studykitId));
  }

  /**
   * update a studykit on db
   * @param {Studykit} studykit - full studykit
   */
  updateStudykitDB(studykit: Studykit) {
    updateDoc(this.getStudykitByIdFromDb(studykit.id), { studykit });
  }
  
}
