import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ChatsComponent } from './chats/chats.component';
import { ChannelComponent } from './channel/channel.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {AuthInterceptor} from "./shared/authconfig.interceptor";
import {AuthGuard} from "./shared/auth.guard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChatElementComponent } from './shared/chat-element/chat-element.component';
import { ChatComponent } from './chats/chat/chat.component';
import { MessageComponent } from './chats/chat/message/message.component';
import {VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import { VideoComponent } from './chats/chat/message/content-view/video/video.component';
import { BodyComponent } from './layout/body/body.component';
import { SelectedFilesComponent } from './chats/chat/selected-files/selected-files.component';

import {MatIconModule} from '@angular/material/icon';
import { ContentElementComponent } from './chats/chat/message/content-element/content-element.component';
import { ContentViewComponent } from './chats/chat/message/content-view/content-view.component';
import { MasterChatComponent } from './layout/master-chat/master-chat.component';
import { ContextMenuComponent } from './shared/context-menu/context-menu.component';
const routes: Routes = [
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },
  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'chats', component:MasterChatComponent, canActivate: [AuthGuard],children: [
          { path: ':name', component: ChatComponent, canActivate: [AuthGuard] }]}
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
    MessageComponent,
    VideoComponent,
    BodyComponent,
    SelectedFilesComponent,
    ContentElementComponent,
    ContentViewComponent,
    MasterChatComponent,
    ContextMenuComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        FormsModule,
        ReactiveFormsModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        MatIconModule ,
    ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
