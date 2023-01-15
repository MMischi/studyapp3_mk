import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Auth } from "@angular/fire/auth";

import { User } from "src/app/services/_interfaces/user";
import { UserService } from "src/app/services/user/user.service";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private auth: Auth,
    private userService: UserService
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
    this.credentials = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      name: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  async createAccount() {
    await this.register();
    await this.storeUser();
  }

  async register() {
    const user = await this.authService.register(this.credentials.value);

    if (user) {
      // authorisation successfull
      this.router.navigateByUrl("/home", { replaceUrl: true });
    } else {
      // TODO: error handling
      console.error("something went wrong");
    }
  }

  async storeUser() {
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
}
