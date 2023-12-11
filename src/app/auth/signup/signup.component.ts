import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import {first} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.scss'],
})

export class SignupComponent implements OnInit {
  protected signupForm: FormGroup;

  constructor(
      public fb: FormBuilder,
      public authService: AuthService,
      public router: Router
  ) {
    this.signupForm = this.fb.group({
      username: [''],
      email: [''],
      phoneNumber: [''],
      password: [''],
    });
  }

  ngOnInit() {}

  protected registerUser() {
    this.authService.signUp(this.signupForm.value).pipe(first()).subscribe((res) => {
      if (res.result) {
        this.signupForm.reset();
        this.router.navigate(['log-in']);
      }
    });
  }
}
