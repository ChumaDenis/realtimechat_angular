import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from "../../messeges/DTOs/Message";
import {ChatService} from "../../../chat-menu/services/chat.service";
import {MessageService} from "../../services/message.service";
import {Chat} from "../../DTOs/Chat";
import {first} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
@UntilDestroy()
@Component({
  selector: 'app-select-chats',
  templateUrl: './select-chats.component.html',
  styleUrls: ['./select-chats.component.scss']
})
export class SelectChatsComponent implements OnInit{
  @Input() message?:Message;
  @Output() CloseForward:EventEmitter<void>=new EventEmitter<void>();
  protected chats:Chat[]=[];
  protected selectedChats:Chat[]=[];
  protected isSelected:boolean=false;
  constructor(private chatService:ChatService, private messageService:MessageService) {
  }
  SelectChat(chat:Chat){
    if(this.selectedChats.includes(chat)){
      this.selectedChats=this.selectedChats.filter(x=>x.name==chat.name);
      if(this.selectedChats.length==0)
        this.isSelected=false;
    }
    else{
      this.selectedChats.push(chat);
      console.log(this.selectedChats);
      this.isSelected=true;
    }
  }
  ngOnInit(): void {
        this.chatService.getChats().pipe(first()).subscribe((chats:Chat[])=>{
          this.chats=chats.filter(x=>x.isChat||x.chatOwner);
        })
    }
  ForwardMessage(){
    this.selectedChats.forEach(x=>{
      this.messageService.forwardMessage(this.message?.id||"", x.name||"").pipe(untilDestroyed(this)).subscribe();
    })


  }

}
