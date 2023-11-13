import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ChatService} from "../chat-menu/chat.service";
import {SignalRService} from "../chat-menu/signal-r.service";

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss']
})
export class NewChatComponent {
  @Output() CloseNewChatEvent=new EventEmitter<any>();
  constructor(private chatService:ChatService, private signalRService:SignalRService) {
  }

  protected chatName:string="";
  protected description:string="";
  protected isChat:boolean=true;
  protected privacy:boolean=true;

  CreateChat(){
    this.signalRService.createChat(this.chatName,this.description, this.isChat, this.privacy)?.then(x=>this.CloseNewChatEvent.emit(""));
  }
  public changeOption1 () {
    this.privacy=true;
    console.log(this.privacy)
  }
  public changeOption2 () {
    this.privacy=false;
    console.log(this.privacy)
  }

}
