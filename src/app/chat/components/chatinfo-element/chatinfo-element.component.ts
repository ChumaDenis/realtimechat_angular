import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Chat} from "../../DTOs/Chat";
import {ChatService} from "../../../chat-menu/services/chat.service";
import {SignalRService} from "../../../chat-menu/services/signal-r.service";

@Component({
  selector: 'app-chatinfo-element',
  templateUrl: './chatinfo-element.component.html',
  styleUrls: ['./chatinfo-element.component.scss']
})
export class ChatinfoElementComponent implements OnInit{
  @Input() ChatInfo?:Chat;
  protected ChatInfoIsOpen=false;
  constructor(private chatService:ChatService, private signalRService:SignalRService) {
  }

  ngOnInit(): void {
    this.SetClickMenuItems();
  }
  protected OpenChatInfo(){
    this.ChatInfoIsOpen=true;
  }

  protected isDisplayContextMenu?: boolean;
  private ClickMenuItems = [
    {
      menuText: 'Leave chat',
      menuEvent: 'Handle leave',
    },
    {
      menuText: 'Delete chat',
      menuEvent: 'Handle delete'
    }
  ];
  public clickMenuItems:{menuText: string,menuEvent: string}[] = [];

  private SetClickMenuItems(){
    this.clickMenuItems=[];
    if(this.ChatInfo?.isOwner){
      this.clickMenuItems.push({
        menuText: 'Delete chat',
        menuEvent: 'Handle delete'
      });
    }
    else{
      this.clickMenuItems.push({
        menuText: 'Delete chat',
        menuEvent: 'Handle delete'
      });
    }
  }
  protected handleMenuItemClick(event:Event) {
    // @ts-ignore
    switch (event.data.menuEvent) {
      case this.ClickMenuItems[0].menuEvent:
        console.log("leave");
        this.signalRService.leaveChat(this.ChatInfo?.name||"")?.then();
        this.isDisplayContextMenu=false;
        break;
      case this.ClickMenuItems[1].menuEvent:
        console.log("delete");
        this.signalRService.deleteChat(this.ChatInfo?.name||"")?.then()
        this.isDisplayContextMenu=false;
        break;
    }
  }




  isOpen=false
  @HostListener('document:click')
  documentClick(): void {
    if(!this.isOpen){
      this.isOpen=true;
    }
    else if(this.isDisplayContextMenu){
      this.isDisplayContextMenu = false;
      this.isOpen=false;
    }

  }
}
