import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

import {
  Firestore,
  doc,
  collection,
  collectionData,
  updateDoc,
  addDoc,
  deleteDoc,
} from "@angular/fire/firestore";
import { Studykit } from "../../_interfaces/studykit";

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
  getStudykitCollection() {
    return collection(this.firestore, this.STUDYKIT_DATA_STORAGE);
  }

  getStudykitByIdFromDb(id: string) {
    return doc(this.firestore, `${this.STUDYKIT_DATA_STORAGE}/${id}`);
  }

  /**
   * retruns data from db storage by key (including id of object)
   *
   * @returns content of studykit storage
   */
  getAllStudykitsDB(): Observable<Studykit[]> {
    return collectionData(this.getStudykitCollection(), {
      idField: "id",
    }) as Observable<Studykit[]>;
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
