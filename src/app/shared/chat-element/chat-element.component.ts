import {Component, Input, OnInit} from '@angular/core';
import {ChatElement} from "../../chats/chatDtos/ChatElement";
import {ChatService} from "../../chats/chat.service";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {SignalRService} from "../../chats/signal-r.service";

@Component({
  selector: 'app-chat-element',
  templateUrl: './chat-element.component.html',
  styleUrls: ['./chat-element.component.scss']
})
export class ChatElementComponent implements OnInit {
  @Input() chat:ChatElement=new ChatElement();
  constructor(private service:ChatService, private router:Router) {
  }
  click(){
    this.router.navigate([`/chat/${this.chat.name}`]);
  }
  ngOnInit(): void {
  }

}
