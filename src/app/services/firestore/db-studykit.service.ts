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
  query,
} from "@angular/fire/firestore";

import { Studykit } from "../_interfaces/studykit";
import { Card } from "../_interfaces/card";
import { where } from "firebase/firestore";
import { Auth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class DbStudykitService {
  private STUDYKIT_DATA_STORAGE = "studykits";

  constructor(private firestore: Firestore, private auth: Auth) {}

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
   * @returns {Studykit | string} Studykit array or 'failed'
   */
  async getAllStudykitsFromDB(): Promise<Studykit[] | "failed"> {
    try {
      const q = query(
        this.getCollection(),
        where("created_by", "==", this.auth.currentUser.uid)
      );
      const docsRef = await getDocs(q);

      let studykitArray: Studykit[] = [];
      docsRef.forEach((doc) => studykitArray.push(doc.data() as Studykit));

      return studykitArray;
    } catch (e) {
      return "failed";
    }
  }

  /**
   * returns one studykit by id from db
   *
   * @param {string} studykitId - id of studykit
   * @returns {Studykit | string} Studykit object or 'failed'
   */
  async getStudykitByIdFromDB(
    studykitId: string
  ): Promise<Studykit | "failed"> | null {
    try {
      const docSnap = await getDoc(this.getDocById(studykitId));
      return docSnap.exists() &&
        docSnap.data().created_by === this.auth.currentUser.uid
        ? (docSnap.data() as Studykit)
        : null;
    } catch (e) {
      return "failed";
    }
  }

  /**
   * stores studykit to db
   *
   * @param {studykit} studykit
   * @returns {string} 'success' or 'failed'
   */
  async storeStudykitToDB(studykit: Studykit): Promise<"success" | "failed"> {
    try {
      await setDoc(doc(this.getCollection(), studykit.id), studykit);
      return "success";
    } catch (e) {
      return "failed";
    }
  }

  /**
   * deletes studykit by id from db
   *
   * @param {string} studykitId - id of studykit
   * @returns {string} 'success' or 'failed'
   */
  async deleteStudykitFromDB(
    studykitId: string
  ): Promise<"success" | "failed"> {
    try {
      await deleteDoc(this.getDocById(studykitId));
      return "success";
    } catch (e) {
      return "failed";
    }
  }

  /**
   * updates a studykit on db
   *
   * @param {Studykit} studykit - full studykit
   * @returns {string} 'success' or 'failed'
   */
  async updateStudykitInDB(studykit: Studykit) {
    studykit.updated_at = new Date();
    try {
      updateDoc(this.getDocById(studykit.id), {
        title: studykit.title,
        cards: studykit.cards,

        created_by: studykit.created_by,
        created_at: studykit.created_at,
        updated_at: studykit.updated_at,
      });
      return "success";
    } catch (e) {
      return "failed";
    }
  }

  /**
   * updates card in studykit by id on db
   *
   * @param { string } studykitId
   * @param { Card } card
   * @returns {string} 'success' or 'failed'
   */
  async updateCardInStudykitInDB(
    studykitId: string,
    card: Card
  ): Promise<"success" | "failed"> {
    const result = await this.getStudykitByIdFromDB(studykitId);
    if (result === "failed") return "failed";

    const studykit = this._updateCardInStudykit(card, result);
    try {
      this.updateStudykitInDB(studykit);
      return "success";
    } catch (e) {
      return "failed";
    }
  }

  /**
   * updates card in given studykit
   *
   * @param {Card} card new card
   * @param {Studykit} studykit in which card should be updated
   * @returns
   */
  _updateCardInStudykit(card: Card, studykit: Studykit): Studykit {
    const cardIdx: number = studykit.cards.findIndex(
      (elem: Card) => elem.id === card.id
    );
    studykit.cards[cardIdx] = card;
    return studykit;
  }
}
