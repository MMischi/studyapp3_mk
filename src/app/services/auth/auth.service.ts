import { Injectable } from "@angular/core";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private auth: Auth) {}

  async register({ email, password }) {
    console.log('register');
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async login({ email, password }) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async logout() {
    return signOut(this.auth);
  }
}
