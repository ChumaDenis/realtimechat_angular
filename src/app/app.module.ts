import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ChatsComponent } from './chats/chats.component';
import { ChannelComponent } from './channel/channel.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ConfigService} from "./config/config.service";
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {AuthInterceptor} from "./shared/authconfig.interceptor";
import {AuthGuard} from "./shared/auth.guard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChatElementComponent } from './shared/chat-element/chat-element.component';
import { ChatComponent } from './chats/chat/chat.component';
import { MessageComponent } from './chats/chat/message/message.component';
const routes: Routes = [
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },
  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'chat/:name', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ChatsComponent,
    ChannelComponent,
    SigninComponent,
    SignupComponent,
    UserProfileComponent,
    ChatElementComponent,
    ChatComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
