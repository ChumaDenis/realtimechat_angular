import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChatService} from "../chat-menu/chats/chat.service";
import {first} from "rxjs";
import {SignalRService} from "../chat-menu/chats/signal-r.service";

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss']
})
export class NewChatComponent {
  @Output() CloseNewChatEvent=new EventEmitter<any>();
  constructor(private chatservice:ChatService, private signalRService:SignalRService) {
  }

  protected chatName:string="";

  CreateChat(){
    this.signalRService.createChat(this.chatName)?.then(x=>this.CloseNewChatEvent.emit(""));
  }

}
