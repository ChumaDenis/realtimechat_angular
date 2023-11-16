import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import {AuthInterceptor} from "./shared/authconfig.interceptor";
import {AuthGuard} from "./shared/auth.guard";
import { ChatComponent } from './chat/chat.component';

import { MasterChatComponent } from './layout/master-chat/master-chat.component';
import {AuthModule} from "./auth/auth.module";
import {SharedModule} from "./shared/shared.module";
import {ChatModule} from "./chat/chat.module";
import {ChatMenuModule} from "./chat-menu/chat-menu.module";

const routes: Routes = [

  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
    { path: '', component:MasterChatComponent,canActivate: [AuthGuard],children:[
            { path: ':name', component: ChatComponent, canActivate: [AuthGuard] }
        ]},
];

@NgModule({
    declarations: [
        AppComponent,
        MasterChatComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        AuthModule,
        ChatModule,
        ChatMenuModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
