import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SigninComponent} from "./signin.component";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from "@abacritt/angularx-social-login";
import {GoogleSigninComponent} from "./components/google-signin/google-signin.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CoolSocialLoginButtonsModule} from "@angular-cool/social-login-buttons";
import { FacebookSigninComponent } from './components/facebook-signin/facebook-signin.component';



@NgModule({
  declarations: [
    SigninComponent,
    GoogleSigninComponent,
    FacebookSigninComponent
  ],
  imports: [
    CommonModule,
    SocialLoginModule,
    ReactiveFormsModule,
    RouterLink,
    CoolSocialLoginButtonsModule
  ],
  providers:[
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('130812456051-r5hu8k3qa23cksg6ddp0cn7u8vinpab9.apps.googleusercontent.com'),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    }
  ],
  exports:[
      SigninComponent
  ]
})
export class SigninModule { }
