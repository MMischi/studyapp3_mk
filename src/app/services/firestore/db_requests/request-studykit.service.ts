import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { DbStudykitService } from "../endpoints/db-studykit.service";
import { Studykit } from "../../_interfaces/studykit";
import { Auth } from "@angular/fire/auth";
import { Card } from "../../_interfaces/card";

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
    this.endpoints.storeStudykitDB(studykit);
  }
}
