import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(private toastController: ToastController) {
    window.addEventListener("offline", () => {
      this.presentToast(
        "bottom",
        "warning",
        "Dein Smartphone ist offline. Daten werden vorläufig nur lokal gespeichert."
      );
    });

    window.addEventListener("online", () => {
      this.presentToast("bottom", "success", "Dein Smartphone ist online.");
    });
  }

  ngOnInit() {
    navigator.onLine
      ? ""
      : this.presentToast(
          "bottom",
          "warning",
          "Dein Smartphone ist offline. Daten werden vorläufig nur lokal gespeichert."
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
      duration: 2000,
      position: position,
      color: color,
    });

    await toast.present();
  }
}
