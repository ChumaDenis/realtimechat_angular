import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {SigninComponent} from "./signin/signin.component";
import {SignupComponent} from "./signup/signup.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {UserinfoElementComponent} from "./userinfo-element/userinfo-element.component";
import {RouterLink, RouterModule, Routes} from "@angular/router";
import {AuthRoutingModule} from "./auth-routing.module";
import {SigninModule} from "./signin/signin.module";


@NgModule({
  declarations: [
    UserProfileComponent,
    SignupComponent,
    UserinfoElementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    AuthRoutingModule,
    SigninModule
  ],
  exports:[
    UserProfileComponent,
    UserinfoElementComponent,
    RouterModule,
    AuthRoutingModule
  ],
  providers:[

  ]
})
export class AuthModule { }
