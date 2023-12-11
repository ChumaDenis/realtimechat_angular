import {Component, EventEmitter, Output} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {SignalRService} from "../../services/signal-r.service";

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss']
})
export class NewChatComponent {
  @Output() CloseNewChatEvent=new EventEmitter<any>();

  protected chatName:string="";
  protected description:string="";
  protected isChat:boolean=true;
  protected privacy:boolean=true;
  constructor(private chatService:ChatService, private signalRService:SignalRService) {
  }
  protected CreateChat(){
    this.signalRService.createChat(this.chatName,this.description, this.isChat, this.privacy)?.then(x=>this.CloseNewChatEvent.emit(""));
  }

}
