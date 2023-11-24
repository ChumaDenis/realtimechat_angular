import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatInfoComponent} from "./components/chatinfo/chat-info.component";
import {SelectChatsComponent} from "./components/select-chats/select-chats.component";
import {MessageComponent} from "./messeges/message.component";
import {VideoComponent} from "./messeges/components/video/video.component";
import {SelectedFilesComponent} from "./messeges/components/selected-files/selected-files.component";
import {ContentViewComponent} from "./messeges/components/content-view/content-view.component";
import {ContentElementComponent} from "./messeges/components/content-element/content-element.component";
import {SharedModule} from "../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {AuthModule} from "../auth/auth.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChatComponent} from "./chat.component";
import {ChatinfoElementComponent} from "./components/chatinfo-element/chatinfo-element.component";
import {VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {MessagesModule} from "./messeges/messages.module";
import {BrowserModule} from "@angular/platform-browser";
import {ChatRoutingModule} from "./chat-routing.module";

@NgModule({
  declarations: [
    ChatComponent,
    ChatInfoComponent,
    ChatinfoElementComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
  ]
})
export class ChatModule { }
