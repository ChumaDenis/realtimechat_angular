import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {Chat} from "../../chat/DTOs/Chat";
import {ChatService} from "../../chat-menu/chats/chat.service";
import {SignalRService} from "../../chat-menu/chats/signal-r.service";

@Component({
  selector: 'app-chatinfo-element',
  templateUrl: './chatinfo-element.component.html',
  styleUrls: ['./chatinfo-element.component.scss']
})
export class ChatinfoElementComponent implements OnInit{
  @Input() ChatInfo?:Chat;

  protected isDisplayContextMenu?: boolean;
  public clickMenuItems = [
    {
      menuText: 'Leave chat',
      menuEvent: 'Handle leave',
    },
    {
      menuText: 'Delete chat',
      menuEvent: 'Handle delete'
    }
  ];
  protected handleMenuItemClick(event:Event) {
    // @ts-ignore
    switch (event.data.menuEvent) {
      case this.clickMenuItems[0].menuEvent:
        console.log("leave");
        this.signalRService.leaveChat(this.ChatInfo?.name||"")?.then();
        this.isDisplayContextMenu=false;
        break;
      case this.clickMenuItems[1].menuEvent:
        console.log("delete");
        this.signalRService.deleteChat(this.ChatInfo?.name||"")?.then()
        this.isDisplayContextMenu=false;
        break;
    }
  }




  protected ChatInfoIsOpen=false;
  constructor(private chatService:ChatService, private signalRService:SignalRService) {
  }

  ngOnInit(): void {
    setTimeout(()=>{console.log(this.ChatInfo?.userViewModels)}, 100)
  }
  OpenChatInfo(){
    this.ChatInfoIsOpen=true;
  }

}
