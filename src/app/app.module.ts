import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ChatsComponent } from './messenger/chat-menu/chats/chats.component';
import { ChannelComponent } from './channel/channel.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {AuthInterceptor} from "./shared/authconfig.interceptor";
import {AuthGuard} from "./shared/auth.guard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChatElementComponent } from './messenger/chat-menu/chat-element/chat-element.component';
import { ChatComponent } from './messenger/chat/chat.component';
import { MessageComponent } from './messenger/general-components/message/message.component';
import {VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import { VideoComponent } from './messenger/general-components/video/video.component';
import { BodyComponent } from './layout/body/body.component';
import { SelectedFilesComponent } from './messenger/general-components/selected-files/selected-files.component';

import {MatIconModule} from '@angular/material/icon';
import { ContentElementComponent } from './messenger/general-components/content-element/content-element.component';
import { ContentViewComponent } from './messenger/general-components/content-view/content-view.component';
import { MasterChatComponent } from './layout/master-chat/master-chat.component';
import { ContextMenuComponent } from './messenger/general-components/context-menu/context-menu.component';
import { ChatinfoElementComponent } from './messenger/general-components/chatinfo-element/chatinfo-element.component';
import { ChatinfoComponent } from './messenger/chatinfo/chatinfo.component';
import { UserinfoElementComponent } from './messenger/chat-menu/userinfo-element/userinfo-element.component';
import { NewChatComponent } from './messenger/new-chat/new-chat.component';
import { ChatMenuComponent } from './messenger/chat-menu/chat-menu.component';
const routes: Routes = [
  { path: '', redirectTo: '/chats', pathMatch: 'full' },
  { path: 'log-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
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
    ContextMenuComponent,
    ChatinfoElementComponent,
    ChatinfoComponent,
    UserinfoElementComponent,
    NewChatComponent,
    ChatMenuComponent
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
