import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ChatMenuComponent } from './chat-menu/chat-menu.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import {AuthInterceptor} from "./shared/authconfig.interceptor";
import {AuthGuard} from "./shared/auth.guard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChatElementComponent } from './chat-menu/components/chat-element/chat-element.component';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './chat/messeges/message/message.component';
import {VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import { VideoComponent } from './chat/messeges/message/components/video/video.component';
import { SelectedFilesComponent } from './chat/messeges/message/components/selected-files/selected-files.component';

import {MatIconModule} from '@angular/material/icon';
import { ContentElementComponent } from './chat/messeges/message/components/content-element/content-element.component';
import { ContentViewComponent } from './chat/messeges/message/components/content-view/content-view.component';
import { MasterChatComponent } from './layout/master-chat/master-chat.component';
import { ContextMenuComponent } from './shared/components/context-menu/context-menu.component';
import { ChatinfoElementComponent } from './shared/components/chatinfo-element/chatinfo-element.component';
import { ChatinfoComponent } from './chatinfo/chatinfo.component';
import { UserinfoElementComponent } from './shared/components/userinfo-element/userinfo-element.component';
import { NewChatComponent } from './new-chat/new-chat.component';
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
    HeaderComponent,
    ChatMenuComponent,
    SigninComponent,
    SignupComponent,
    UserProfileComponent,
    ChatElementComponent,
    ChatComponent,
    MessageComponent,
    VideoComponent,
    SelectedFilesComponent,
    ContentElementComponent,
    ContentViewComponent,
    MasterChatComponent,
    ContextMenuComponent,
    ChatinfoElementComponent,
    ChatinfoComponent,
    UserinfoElementComponent,
    NewChatComponent
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
        MatIconModule,
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
