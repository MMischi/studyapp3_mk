import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;
  login_unsuccessful: boolean = false;

  constructor(
   @Inject(FormBuilder) private fb: FormBuilder,
   @Inject(AuthService) private authService: AuthService,
   @Inject(Router) private router: Router
  ) {}

  get email() {
    return this.credentials.get("email");
  }

  get password() {
    return this.credentials.get("password");
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }

  async login() {
    const user = await this.authService.login(this.credentials.value);

    if (user) {
      // login successfull
      this.router.navigateByUrl("/home", { replaceUrl: true });
    } else {
      this.login_unsuccessful = true;
    }
  }
}
