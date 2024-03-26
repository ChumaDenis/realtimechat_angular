import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import {SocialAuthService} from "@abacritt/angularx-social-login";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
@UntilDestroy()
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss','../auth.scss'],
})

export class SigninComponent implements OnInit, OnDestroy {
  protected signinForm: FormGroup;

  constructor(
      public fb: FormBuilder,
      public myAuthService: AuthService,
      public router: Router,
      private authService: SocialAuthService) {
    this.signinForm = this.fb.group({
      username: "",
      password: "",
    });
  }



  ngOnInit() {
    this.authService.authState.pipe(untilDestroyed(this)).subscribe((user) => {
      this.myAuthService.signInWithGoogle(user);
    });
  }
  ngOnDestroy(): void {
  }
  protected loginUser() {
    this.myAuthService.signIn(this.signinForm.value);
  }
  protected googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }
  protected facebookSignin(response:any){
    if(response)
      this.myAuthService.signInWithFacebook(response);
  }
}
