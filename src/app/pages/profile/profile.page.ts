import { Component, OnInit } from "@angular/core";
import { Auth } from "@angular/fire/auth";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { UserService } from "src/app/services/user/user.service";
import { User } from "src/app/services/_interfaces/user";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,

    private auth: Auth,
    private userService: UserService,
    private toastController: ToastController
  ) {}

  user: User = {
    id: "",
    email: "",
    nickname: "",
    created_at: undefined,
    updated_at: undefined,
  };

  get name() {
    return this.credentials.get("name");
  }

  async ngOnInit() {
    this.credentials = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  async ionViewWillEnter() {
    const result = await this.userService.getUserByIdFromDB(
      this.auth.currentUser.uid
    );

    if (result === "failed")
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
    else this.user = result;
  }

  async updateUser() {
    this.user.nickname = this.credentials.value.name;

    const result = await this.userService.updateStudykitInDB(this.user);
    if (result === "failed")
      this.presentToast(
        "bottom",
        "danger",
        "Ein Fehler bei der Datenübertragung zum Server ist aufgetreten."
      );
    else this.presentToast("bottom", "success", "Daten gespeichert.");
  }

  /**
   * show toast
   * @param {string} position - "top" | "middle" | "bottom"
   * @param {string} color - "danger" | "warning" | "primary" | "light" | "success"
   * @param {string} msg - individual
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
