import {Component, Input} from '@angular/core';
import {ChatElement} from "../../chatDtos/ChatElement";
import {ChatService} from "../../chat.service";
import {Router} from "@angular/router";
import {Message} from "../../../shared/Dtos/Message";
import {MessageService} from "../message.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() messsage:Message=new Message();

  constructor(private service:MessageService, private router:Router) {
  }

  deleteMessage(){
    this.service.deleteMessage(this.messsage.id||"").subscribe(x=>console.log(x));
  }

}
