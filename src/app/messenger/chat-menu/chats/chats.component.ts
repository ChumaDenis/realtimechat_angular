import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "./chat.service";
import {ChatElement} from "../../chat/DTOs/ChatElement";
import {SignalRService} from "./signal-r.service";
import {first, Subject, takeUntil} from "rxjs";
import {Message} from "../../../shared/Dtos/Message";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy{
    public chats:ChatElement[]=[];
    private subject=new Subject<void>();
  constructor(private service:ChatService, private signalR:SignalRService) {
    this.service.getChats().pipe(first()).subscribe(data=>{
          this.FormatLastMessage(data as ChatElement[])
    });
  }

    ngOnDestroy(): void {
        this.subject.next();
        this.subject.complete()
    }

    private FormatLastMessage(chats:ChatElement[]){
      chats.map(x =>{
          if(x.lastMessage){

              if(x.lastMessage?.textContent==""&&x.lastMessage.contentFiles){
                  // @ts-ignore
                  if(x.lastMessage.contentFiles.length>1)
                    x.lastMessage.textContent="files";
                  else if(x.lastMessage.contentFiles[0].eContentType==1){
                    x.lastMessage.textContent="image";
                  }
                  else if(x.lastMessage.contentFiles[0].eContentType==2){
                      x.lastMessage.textContent="video";
                  }
                  else{
                      x.lastMessage.textContent="file";
                  }
              }
          }
          else{
              const message=new Message();
              message.textContent="Chat was created!";
              message.sendTime=x.createdDate;
          }
          this.chats.push(x)
      })
    }

    ngOnInit(): void {
        this.signalR.connect();
        this.signalR.addListenerForChats().pipe(takeUntil(this.subject)).subscribe(x=>{
            this.chats.map(y=>{
                if(y.name==x.chatName){
                    y.lastMessage=x;
                }
            })
            this.SortChats();
        });
    }


    private SortChats() {
        this.chats= this.chats.sort((a, b) => {
            // @ts-ignore
            return <any>new Date(b.lastMessage?.sendTime) - <any>new Date(a.lastMessage?.sendTime);
        });
    }

}
