import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import {GoogleLoginProvider, SocialAuthService} from "angularx-social-login";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})

export class SigninComponent implements OnInit {
  signinForm: FormGroup;

  constructor(
      public fb: FormBuilder,
      public myAuthService: AuthService,
      public router: Router) {
    this.signinForm = this.fb.group({
      username: "",
      password: "",
    });
  }

  ngOnInit() {}

  loginUser() {
    this.myAuthService.signIn(this.signinForm.value);
  }
}
