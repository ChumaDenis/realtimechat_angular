import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "./services/chat.service";
import {ChatElement} from "../chat/DTOs/ChatElement";
import {SignalRService} from "./services/signal-r.service";
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
    public selectedChats:ChatElement[]=[];

    protected isNewChatFormOpen=false;
    private subject=new Subject<void>();
    constructor(private service:ChatService,
                private signalR:SignalRService,
                private authService:AuthService,
                private avatarService:AvatarService,
                private router:Router,
                private activatedRouter:ActivatedRoute) {
        this.getChats()
    }


    ngOnInit(): void {
      this.SetSignalRListeners();
    }
    ngOnDestroy(): void {
      this.subject.next();
      this.subject.complete()
    }

    protected selectAllChats(){
        this.selectedChats=this.chats;
    }
    protected selectChats(){
        this.selectedChats=this.chats.filter(x=>x.isChat==true);
    }
    protected selectChannels(){
        this.selectedChats=this.chats.filter(x=>x.isChat==false);
    }

    protected GetPublicChannels(){
        this.service.getPublicChat().pipe(first()).subscribe(x=>{
            this.selectedChats=this.FormatLastMessage(x);
        })
    }
    private SetSignalRListeners(){
        this.signalR.connect();
        this.signalR.addListenerForChats().pipe(takeUntil(this.subject)).subscribe(x=>{
            this.chats.map(y=>{
                if(y.name==x.chatName){
                    y.lastMessage=x;
                    if(this.router.parseUrl(this.router.url).root.children.primary){
                        const chatName=this.router.parseUrl(this.router.url).root.children.primary.segments[0].path;
                        if( chatName!=y.name){
                            // @ts-ignore
                            y.unreadMessages.unreadMessage+=1;
                        }
                    }
                    else{
                        // @ts-ignore
                        y.unreadMessages.unreadMessage+=1;
                    }
                }
            })
            this.SortChats();
        });

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

        this.authService.getUserProfile().pipe(first()).subscribe(x=> {

            this.downloadAvatar();
            this.signalR.getUserStatus().pipe(takeUntil(this.subject)).subscribe(y=>{
                this.User = x;
                if(this.User?.status){
                    this.User.status=y;
                }
            });
        })
    }
    protected FindChat(InputText:string){
      this.selectedChats=this.chats?.filter(x=>x.name?.includes(InputText));
    }
    private getChats(){
        this.service.getChats().pipe(first()).subscribe(data=>{
            this.chats= this.FormatLastMessage(data as ChatElement[]);
            this.selectedChats=this.chats;
        });
    }
    private downloadAvatar(){
        const avatar=localStorage.getItem("userAvatar");
        let avatarJson:any="";
        if(avatar) avatarJson = JSON.parse(avatar);
        if((avatarJson!="" && avatarJson.id!=this.User?.avatar?.id)||avatarJson==""){
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
    private FormatLastMessage(chats:ChatElement[]){
        let chatsList:ChatElement[]=[];
        chats.map(x =>{
            if(x.lastMessage){
                if(!x.lastMessage.textContent&&x.lastMessage.contentFiles){
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
            chatsList.push(x)
        })
        return chatsList;
    }
}
