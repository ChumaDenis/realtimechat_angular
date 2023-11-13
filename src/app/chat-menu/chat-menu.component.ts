import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "./chat.service";
import {ChatElement} from "../chat/DTOs/ChatElement";
import {SignalRService} from "./signal-r.service";
import {first, Subject, takeUntil} from "rxjs";
import {Message} from "../chat/messeges/DTOs/Message";
import {User} from "../shared/Dtos/Auth/User";
import {AuthService} from "../shared/auth.service";
import {AvatarService} from "../shared/avatar.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
  selector: 'app-chats',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.scss']
})
export class ChatMenuComponent implements OnInit, OnDestroy{
    protected User?:User;
    public chats:ChatElement[]=[];
    public selectChats:ChatElement[]=[];
    private subject=new Subject<void>();
    protected isNewChatFormOpen=false;
  constructor(private service:ChatService, private signalR:SignalRService, private authService:AuthService,
              private avatarService:AvatarService, private router:Router, private activatedRouter:ActivatedRoute) {
      this.getChats()
  }
    getChats(){
        this.service.getChats().pipe(first()).subscribe(data=>{
            this.FormatLastMessage(data as ChatElement[])

            this.selectChats=this.chats;
            console.log(this.chats)
        });
    }
    GetAllChats(){
      this.selectChats=this.chats;
    }
    GetChats(){
        this.selectChats=this.chats.filter(x=>x.isChat==true);
    }
    GetChannels(){
      this.selectChats=this.chats.filter(x=>x.isChat==false);
    }

    ngOnDestroy(): void {
        this.subject.next();
        this.subject.complete()
    }

    private FormatLastMessage(chats:ChatElement[]){
      this.chats=[];
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
        this.authService.getUserProfile().pipe(first()).subscribe(x=> {
            this.User = x
            this.downloadAvatar();
        })

        this.signalR.AddChatListener().pipe(takeUntil(this.subject)).subscribe(x=>{
            this.router.navigate([`/chats/${x}`]);
            this.getChats();
        })
        this.signalR.UpdateChatListener().pipe(takeUntil(this.subject)).subscribe((x)=>{
            this.activatedRouter.params.pipe(first()).subscribe(y=>{
                if(y[0]!=x.newName){
                    this.router.navigate([`/chats/${x.newName}`]);
                }
            })
            this.getChats();
        })
        this.signalR.DeleteChatListener().pipe(takeUntil(this.subject)).subscribe((x)=>{
            this.activatedRouter.params.pipe(first()).subscribe(y=>{
                if(y[0]!=x){
                    this.router.navigate([`/chats`]);
                }
            })
            this.getChats();
        })
    }
    downloadAvatar(){
        const avatarJson=JSON.parse(localStorage.getItem("userAvatar")||"");
        console.log(avatarJson);
        if(avatarJson || avatarJson.id!=this.User?.avatar?.id){
            this.avatarService.getAvatar(this.User?.userName||"").pipe().subscribe(file=>{
                let x=this.avatarService.convertBlobToBase64(file);
                x.subscribe((y:any)=>{
                    const avatarInfo={
                        id:this.User?.avatar?.id,
                        file:`${y}`
                    };
                    localStorage.setItem("userAvatar", JSON.stringify(avatarInfo))
                })
            })
        }

    }

    private SortChats() {
        this.chats= this.chats.sort((a, b) => {
            // @ts-ignore
            return <any>new Date(b.lastMessage?.sendTime) - <any>new Date(a.lastMessage?.sendTime);
        });
    }

}
