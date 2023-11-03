import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatElement} from "../../chatDtos/ChatElement";
import {ChatService} from "../../chat.service";
import {Router} from "@angular/router";
import {Message} from "../../../shared/Dtos/Message";
import {MessageService} from "../message.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Content} from "../../../shared/Dtos/Content";
import {Video} from "../../../shared/Dtos/Video";
import {first} from "rxjs";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit{
  @Input() messsage:Message=new Message();
  @Output() MessageChangeEvent = new EventEmitter<Message>()


  protected isYourMessage?:boolean=false;
  protected isYourChat:boolean=false;
  protected isActive:boolean=false;
  protected hasFiles=false;
  protected currentContent?:Content;

  constructor(private service:MessageService) {
  }

  ngOnInit(): void {
    this.CheckRoots()
    if(this.messsage.contentFiles && this.messsage.contentFiles.length>0)
      this.hasFiles=true;
  }
  protected updateMessage() {
    this.MessageChangeEvent.emit(this.messsage);
  }
  protected deleteMessage(){
    this.service.deleteMessage(localStorage.getItem("currentChat")||"",this.messsage.id||"")
        .pipe(first()).subscribe();
  }

  protected filterContent(){
    return this.messsage.contentFiles?.filter(x=>x.eContentType!=3);
  }

  protected onRightClick(event:Event) {
    //event.preventDefault()
  }
  protected getMessageStyles() {
      let userName=localStorage.getItem("userName");
      if (userName===this.messsage.owner?.userName) {
        return 'margin-left: auto;';
      }
      return '';
  }


  private CheckRoots(){
    if(this.messsage.owner?.userName==localStorage.getItem("userName"))
      this.isYourMessage=true;
    if(localStorage.getItem("currentChatOwner")==localStorage.getItem("userName"))
      this.isYourChat=true;
  }
}
