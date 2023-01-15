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
   *
   * @returns full studykit collection
   */
  getCollection() {
    return collection(this.firestore, this.STUDYKIT_DATA_STORAGE);
  }

  /**
   * create reference to specific doc
   *
   * @param {string} id
   * @returns
   */
  getDocById(id: string) {
    return doc(this.firestore, this.STUDYKIT_DATA_STORAGE, id);
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
   * returns one studykit by id from db
   *
   * @param {string} studykitId - id of studykit
   * @returns
   */
  async getStudykitByIdFromDB(studykitId: string): Promise<Studykit> | null {
    const docSnap = await getDoc(this.getDocById(studykitId));
    return docSnap.exists() ? (docSnap.data() as Studykit) : null;
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
