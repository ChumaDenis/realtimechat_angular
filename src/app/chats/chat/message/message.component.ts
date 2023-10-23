import {Component, Input} from '@angular/core';
import {ChatElement} from "../../chatDtos/ChatElement";
import {ChatService} from "../../chat.service";
import {Router} from "@angular/router";
import {Message} from "../../../shared/Dtos/Message";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() messsage:Message=new Message();
  constructor(private service:ChatService, private router:Router) {
  }



}
