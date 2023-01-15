import { Injectable } from "@angular/core";
import { collection, doc, Firestore, getDoc, getDocs, setDoc, updateDoc } from "@angular/fire/firestore";

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
   * @returns content of users storage
   */
  async getAllUsersFromDB(): Promise<User[]> {
    const docsRef = await getDocs(this.getCollection());

    let usersArray: User[] = [];
    docsRef.forEach((doc) => usersArray.push(doc.data() as User));

    return usersArray;
  }

  /**
   * returns one user by id from db
   *
   * @param {string} userId - id of user
   * @returns
   */
  async getUserByIdFromDB(userId: string): Promise<User> | null {
    const docSnap = await getDoc(this.getDocById(userId));
    return docSnap.exists() ? (docSnap.data() as User) : null;
  }

  /**
   * stores user to db
   * 
   * @param {User} user 
   */
  async storeUserToDB(user: User) {
    await setDoc(doc(this.getCollection(), user.id), user);
  }

  /**
   * updates an user on db
   *
   * @param {User} user - full user
   */
  async updateStudykitInDB(user: User) {
    user.updated_at = new Date();
    updateDoc(this.getDocById(user.id), {
      nickname: user.nickname,

      created_at: user.created_at,
      updated_at: user.updated_at,
    });
  }
}
