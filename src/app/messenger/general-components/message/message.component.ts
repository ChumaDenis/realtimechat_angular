import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {ChatElement} from "../../chat/DTOs/ChatElement";
import {ChatService} from "../../chat-menu/chats/chat.service";
import {Router} from "@angular/router";
import {Message} from "../../../shared/Dtos/Message";
import {MessageService} from "../../chat/message.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Content} from "../../../shared/Dtos/Content";
import {Video} from "../../../shared/Dtos/Video";
import {first} from "rxjs";
import {ContextMenuModel} from "../context-menu/context-menu.component";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit{
  @Input() message:Message=new Message();
  @Output() MessageChangeEvent = new EventEmitter<Message>()
  @Output() MessageReplyEvent = new EventEmitter<Message>()

  protected isYourMessage?:boolean=false;
  protected isYourChat:boolean=false;
  protected isActive:boolean=false;
  protected hasFiles=false;
  protected currentContent?:Content;

  constructor(private service:MessageService) {
  }

  ngOnInit(): void {
    this.CheckRoots();
    if(this.message.messageReply){
      this.FormatMessage(this.message.messageReply);
    }
    if(this.message.contentFiles && this.message.contentFiles.length>0)
      this.hasFiles=true;
  }
  protected updateMessage() {
    this.MessageChangeEvent.emit(this.message);
  }
  protected ReplyMessage() {
    this.MessageReplyEvent.emit(this.message);
  }
  protected deleteMessage(){
    this.service.deleteMessage(localStorage.getItem("currentChat")||"",this.message.id||"")
        .pipe(first()).subscribe();
  }

  protected filterContent(){
    return this.message.contentFiles?.filter(x=>x.eContentType!=3);
  }

  protected getMessageStyles() {
      let userName=localStorage.getItem("userName");
      if (userName===this.message.owner?.userName) {
        return 'margin-left: auto;';
      }
      return '';
  }


  private CheckRoots(){
    if(this.message.owner?.userName==localStorage.getItem("userName"))
      this.isYourMessage=true;
    if(localStorage.getItem("currentChatOwner")==localStorage.getItem("userName"))
      this.isYourChat=true;
  }
  private FormatMessage(message:Message){

    if(message){
      if(message?.textContent==null&&message.contentFiles){
        let text="";
        // @ts-ignore
        if(message.contentFiles.length>1)
          text="files";
        else if(message.contentFiles[0].eContentType==1){
          text="image";
        }
        else if(message.contentFiles[0].eContentType==2){
          text="video";
        }
        else{
          text="file";
        }
        // @ts-ignore
        this.message.messageReply.textContent=text;
      }
    }


  }













  title = 'context-menu';

  isDisplayContextMenu?: boolean;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX?: number;
  rightClickMenuPositionY?: number;

  displayContextMenu(event:Event) {
    this.isDisplayContextMenu = true;
    this.rightClickMenuItems = [
      {
        menuText: 'Reply',
        menuEvent: 'Handle reply',
      }
    ];
    if(this.isYourMessage){
      this.rightClickMenuItems.push({
              menuText: 'Edit',
              menuEvent: 'Handle edite',
          },
          {
              menuText: 'Delete',
              menuEvent: 'Handle delete',
          })
    }
    else if(this.isYourChat){
        this.rightClickMenuItems.push(
            {
                menuText: 'Delete',
                menuEvent: 'Handle delete',
            })
    }
    // @ts-ignore
      this.rightClickMenuPositionX = event.clientX;
    // @ts-ignore
      this.rightClickMenuPositionY = event.clientY;

  }


  getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`
    }
  }

  handleMenuItemClick(event:Event) {
    // @ts-ignore
      console.log(event.data.menuEvent);
    // @ts-ignore
      switch (event.data.menuEvent) {
      case this.rightClickMenuItems[0].menuEvent:
        this.ReplyMessage();
        break;
      case this.rightClickMenuItems[1].menuEvent:
        this.updateMessage();
        break;
      case this.rightClickMenuItems[2].menuEvent:
        this.deleteMessage();
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }

}
