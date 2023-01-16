import { Injectable } from "@angular/core";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "@angular/fire/firestore";

import { AuthService } from "../auth/auth.service";
import { User } from "../_interfaces/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private USER_DATA_STORAGE = "user";

  constructor(private firestore: Firestore, private authService: AuthService) {}

  /**
   * creates reference to collection
   *
   * @returns full studykit collection
   */
  getCollection() {
    return collection(this.firestore, this.USER_DATA_STORAGE);
  }

  /**
   * create reference to specific doc
   *
   * @param {string} id
   * @returns
   */
  getDocById(id: string) {
    return doc(this.firestore, this.USER_DATA_STORAGE, id);
  }

  /**
   * retruns users from db
   *
   * @returns {User[] | string} content of users storage | 'failed'
   */
  async getAllUsersFromDB(): Promise<User[] | "failed"> {
    try {
      const docsRef = await getDocs(this.getCollection());

      let usersArray: User[] = [];
      docsRef.forEach((doc) => usersArray.push(doc.data() as User));

      return usersArray;
    } catch (e) {
      return "failed";
    }
  }

  /**
   * returns one user by id from db
   *
   * @param {string} userId - id of user
    * @returns {User | string} user | 'failed'
   */
  async getUserByIdFromDB(userId: string): Promise<User | 'failed'> | null {
    try {
      const docSnap = await getDoc(this.getDocById(userId));
      return docSnap.exists() ? (docSnap.data() as User) : null;
    } catch(e) {
      return 'failed';
    }
  }

  /**
   * stores user to db
   *
   * @param {User} user
   * @returns {string} 'success' or 'failed'
   */
  async storeUserToDB(user: User): Promise<'success' | 'failed'> {
    try {
      await setDoc(doc(this.getCollection(), user.id), user);
      return 'success';
    } catch(e) {
      return 'failed';
    }
  }

  /**
   * updates an user on db
   *
   * @param {User} user - full user
   * @returns {string} 'success' or 'failed'
   */
  async updateStudykitInDB(user: User): Promise<'success' | 'failed'> {
    try {
      user.updated_at = new Date();
      updateDoc(this.getDocById(user.id), {
        nickname: user.nickname,
  
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
      return 'success';
    } catch(e) {
      return 'failed';
    }
  }
}
