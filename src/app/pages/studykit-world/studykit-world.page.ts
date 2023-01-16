import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-studykit-world",
  templateUrl: "./studykit-world.page.html",
  styleUrls: ["./studykit-world.page.scss"],
})
export class StudykitWorldPage implements OnInit {
  constructor(private toastController: ToastController) {
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    window.addEventListener("online", () => {
      this.isOnline = true;
    });
  }

  isOnline: boolean;

  ngOnInit() {
    this.isOnline = navigator.onLine;
  }

  async ionViewWillEnter() {
    if (!this.isOnline)
      this.presentToast(
        "bottom",
        "warning",
        "Es besteht keine Internetverbindung."
      );
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
