import {Component, Input} from '@angular/core';
import {Chat} from "../chatDtos/Chat";
import {ChatService} from "../chat.service";
import {ActivatedRoute} from "@angular/router";
import {Message} from "../../shared/Dtos/Message";
import {MessageService} from "./message.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public Messages?:Message[];
  public ChatInfo?:Chat;
  constructor(
      private chatService:ChatService,
      private messageService:MessageService,
      private route: ActivatedRoute) {

    this.route.params.subscribe(p=>{
      this.chatService.getChat(p.name).subscribe(x=>{
        this.ChatInfo=x;
        console.log(this.ChatInfo);

        this.messageService.getMessages(this.ChatInfo?.name||"").subscribe(r=>{
          this.Messages=r.items;
          console.log(this.Messages);
        })
      })
    })
  }
}
