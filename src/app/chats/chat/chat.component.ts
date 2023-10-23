import {Component, Input} from '@angular/core';
import {Chat} from "../chatDtos/Chat";
import {ChatService} from "../chat.service";
import {ActivatedRoute} from "@angular/router";
import {Message} from "../../shared/Dtos/Message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public Messages?:Message[];
  public ChatInfo?:Chat;
  constructor(private service:ChatService, private route: ActivatedRoute) {
    this.route.params.subscribe(p=>{
      this.service.getChat(p.name).subscribe(x=>{
        this.ChatInfo=x;
        console.log(x);

        this.service.getMessages(this.ChatInfo?.name||"").subscribe(r=>{
          this.Messages=r.items;
          console.log(this.Messages);
        })
      })
    })
  }
}
