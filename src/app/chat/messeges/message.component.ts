import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Message} from "./DTOs/Message";
import {MessageService} from "../services/message.service";
import {Content} from "./DTOs/Content";
import {first} from "rxjs";
import {ContextMenuModel} from "../../shared/components/context-menu/context-menu.component";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit{
  @Input() message:Message=new Message();
  @Output() MessageChangeEvent = new EventEmitter<Message>()
  @Output() MessageReplyEvent = new EventEmitter<Message>()
  @Output() MessageForwardEvent = new EventEmitter<string>()

  protected isYourMessage?:boolean=false;
  protected isYourChat:boolean=false;
  protected isActive:boolean=false;
  protected hasFiles=false;
  protected currentContent?:Content;
  protected forwardMessage:boolean=false;

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
  protected UpdateMessage() {
    this.MessageChangeEvent.emit(this.message);
  }
  protected ReplyMessage() {
    this.MessageReplyEvent.emit(this.message);
  }
  protected DeleteMessage(){
    this.service.deleteMessage(localStorage.getItem("currentChat")||"",this.message.id||"")
        .pipe(first()).subscribe();
  }
  protected ForwardMessage(){
    this.forwardMessage=true;
  }
  protected FilterContent(){
    return this.message.contentFiles?.filter(x=>x.eContentType!=3);
  }

  protected GetMessageStyles() {
      let userName=localStorage.getItem("userName");
      if (userName===this.message.owner?.userName) {
        return 'margin-left: auto;';
      }
      return '';
  }

  private FormatMessage(message:Message){
    if(message&&message){
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

  protected isDisplayContextMenu?: boolean;
  protected rightClickMenuItems: Array<ContextMenuModel> = [];
  protected rightClickMenuPositionX?: number;
  protected rightClickMenuPositionY?: number;
  private menuItems: Array<ContextMenuModel> = [
    {
    menuText: 'Reply',
    menuEvent: 'Handle reply',
    },
    {
      menuText: 'Forward',
      menuEvent: 'Handle forward',
    },
    {
    menuText: 'Edit',
    menuEvent: 'Handle edite',
    },
    {
      menuText: 'Delete',
      menuEvent: 'Handle delete',
    }
  ];
  protected displayContextMenu(event:Event) {
    this.isDisplayContextMenu = true;
    this.rightClickMenuItems = [
      {
        menuText: 'Reply',
        menuEvent: 'Handle reply',
      },
      {
        menuText: 'Forward',
        menuEvent: 'Handle forward',
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

  protected getRightClickMenuStyle() {
    return {
      position: 'fixed',
      left: `${this.rightClickMenuPositionX}px`,
      top: `${this.rightClickMenuPositionY}px`
    }
  }
  private CheckRoots(){
    if(this.message.owner?.userName==localStorage.getItem("userName"))
      this.isYourMessage=true;
    if(localStorage.getItem("currentChatOwner")==localStorage.getItem("userName"))
      this.isYourChat=true;
  }
  protected handleMenuItemClick(event:Event) {
      // @ts-ignore
    switch (event.data.menuEvent) {
      case this.menuItems[0].menuEvent:
        this.ReplyMessage();
        break;
      case this.menuItems[1].menuEvent:
        this.ForwardMessage();
        break;
      case this.menuItems[2].menuEvent:
        this.UpdateMessage();
        break;
      case this.menuItems[3].menuEvent:
        this.DeleteMessage();
        break;
      default:
        this.isDisplayContextMenu=false;
        break
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
    this.isOpen=false;
  }
  protected isOpen=false
  @HostListener('document:contextmenu')
  documentContextMenuClick(): void {
    if(!this.isOpen){
      this.isOpen=true;
    }
    else if(this.isDisplayContextMenu){
      this.isDisplayContextMenu = false;
      this.isOpen=false;
    }
  }
}
