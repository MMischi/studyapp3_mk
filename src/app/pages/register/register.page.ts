import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Auth } from "@angular/fire/auth";

import { User } from "src/app/services/_interfaces/user";
import { UserService } from "src/app/services/user/user.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,

    private auth: Auth,
    private authService: AuthService,
    private userService: UserService,

    private router: Router,
    private toastController: ToastController
  ) {}

  get email() {
    return this.credentials.get("email");
  }

  get password() {
    return this.credentials.get("password");
  }

  get name() {
    return this.credentials.get("name");
  }

  ngOnInit() {
    if (!navigator.onLine)
      this.presentToast(
        "bottom",
        "danger",
        "Stelle sicher, dass eine aktive Internetverbindung besteht."
      );

    this.credentials = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      name: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  async createAccount() {
    if (!navigator.onLine) {
      this.presentToast(
        "bottom",
        "danger",
        "Stelle sicher, dass eine aktive Internetverbindung besteht."
      );
      return;
    }

    await this.register();
  }

  async register() {
    if (!navigator.onLine) {
      this.presentToast(
        "bottom",
        "danger",
        "Stelle sicher, dass eine aktive Internetverbindung besteht."
      );
      return;
    }

    const result = await this.authService.register(this.credentials.value);
    if(result === 'auth/email-already-in-use') {
      this.presentToast(
        "bottom",
        "danger",
        "Email Adresse wird bereits genutzt."
      );
      return;
    } else if (result) {
      await this.storeUser();
      this.router.navigateByUrl("/home", { replaceUrl: true });
      return;
    } else {
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler ist aufgetreten."
      );
      return;
    }
  }

  async storeUser() {
    if (!navigator.onLine) {
      this.presentToast(
        "bottom",
        "danger",
        "Stelle sicher, dass eine aktive Internetverbindung besteht."
      );
      return;
    }
    
    const user = this.createUser();
    await this.userService.storeUserToDB(user);
  }

  createUser(): User {
    const userValues = this.credentials.value;
    return {
      id: this.auth.currentUser.uid,
      email: userValues.email,
      nickname: userValues.name,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  /**
   * Shows toast
   * @param {string} position "top" | "middle" | "bottom"
   * @param {string} color "danger" | "warning" | "primary" | "light" | "success"
   * @param {string} msg individual
   */
  async presentToast(
    position: "top" | "middle" | "bottom",
    color: "danger" | "warning" | "primary" | "light" | "success",
    msg: string
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: position,
      color: color,
    });

    await toast.present();
  }
}
