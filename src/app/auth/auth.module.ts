import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {SigninComponent} from "./signin/signin.component";
import {SignupComponent} from "./signup/signup.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {UserinfoElementComponent} from "./userinfo-element/userinfo-element.component";



@NgModule({
  declarations: [
    UserProfileComponent,
    SigninComponent,
    SignupComponent,
    UserinfoElementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule

  ],
  exports:[
    UserProfileComponent,
    SigninComponent,
    SignupComponent,
    UserinfoElementComponent
  ]
})
export class AuthModule { }
