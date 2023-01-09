import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {

  user_nickname: string;
  user_email: string;
  user_password: string;
  user_password_secure: string;

  constructor() { }

  ngOnInit() {
  }

}
