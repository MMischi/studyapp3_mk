import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { DbStudykitService } from "../endpoints/db-studykit.service";
import { Studykit } from "../../_interfaces/studykit";
import { StudykitDTO } from "../endpoints/dto/dto_studykit";
import { uuidv4 } from "@firebase/util";
import { title } from "process";
import { Auth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class RequestStudykitService {
  constructor(private endpoints: DbStudykitService, private auth: Auth) {}

  /**
   * redirects db request to permission layer
   * @returns
   */
  getStudykitsFromDB(): Observable<Studykit[]> {
    return this.endpoints.getAllStudykitsDB() as Observable<Studykit[]>;
  }

  /**
   * redirects db request to permission layer
   */
  storeStudykitToDB(studykit: Studykit) {
    const studykitForDB: StudykitDTO = {
      id: uuidv4(),
      title: studykit.title,
      cards: [],
      created_by: this.auth.currentUser.uid,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.endpoints.storeStudykitDB(studykitForDB);
  }
}
