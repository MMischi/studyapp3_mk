import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { StudykitDTO } from './dto/dto_studykit';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';

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
  getAllStudykitsDB(): Observable<StudykitDTO[]> {
    return collectionData(this.getStudykitCollection(), {idField: 'id'}) as Observable<StudykitDTO[]>;
  } 

  /**
   * store studykit to db
   */
  storeStudykitDB(studykit: StudykitDTO) {
    addDoc(this.getStudykitCollection(), studykit);
  }
}
