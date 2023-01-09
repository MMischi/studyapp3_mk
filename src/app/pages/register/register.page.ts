import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user_nickname: string;
  user_email: string;
  user_password: string;
  user_password_secure: string;

  constructor() { }

  ngOnInit() {
  }

}
