import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Studykit } from '../../_interfaces/studykit';

@Injectable({
  providedIn: 'root'
})
export class DbStudykitService {
  
  private STUDYKIT_DATA_STORAGE = 'studykits';

  constructor(private firestore: Firestore) { }

  /**
   * creates reference to collection
   * @returns full studykit collection
   */
  getStudykitCollection() {
    return collection(this.firestore, this.STUDYKIT_DATA_STORAGE);
  }

  /**
   * retruns data from db storage by key (including id of object)
   * 
   * @returns content of studykit storage
   */
  getAllStudykitsDB(): Observable<Studykit[]> {
    return collectionData(this.getStudykitCollection(), {idField: 'id'}) as Observable<Studykit[]>;
  } 

  /**
   * store studykit to db
   */
  storeStudykitDB(studykit: Studykit) {
    addDoc(this.getStudykitCollection(), studykit);
  }
}
