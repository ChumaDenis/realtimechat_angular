import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatElementComponent} from "./components/chat-element/chat-element.component";
import {ChatMenuComponent} from "./chat-menu.component";
import {AuthModule} from "../auth/auth.module";
import {NewChatComponent} from "./components/new-chat/new-chat.component";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ChatElementComponent,
    ChatMenuComponent,
    NewChatComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    MatIconModule,
    FormsModule
  ],
  exports:[
    ChatMenuComponent
  ]
})
export class ChatMenuModule { }
