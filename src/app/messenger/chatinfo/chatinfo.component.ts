import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat} from "../chat/DTOs/Chat";
import {SignalRService} from "../chat-menu/chats/signal-r.service";
import {first, from, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ChatService} from "../chat-menu/chats/chat.service";
import {AuthService} from "../../shared/auth.service";
import {User} from "../../shared/Dtos/User";
@UntilDestroy()
@Component({
  selector: 'app-chatinfo',
  templateUrl: './chatinfo.component.html',
  styleUrls: ['./chatinfo.component.scss']
})
export class ChatinfoComponent implements OnInit{
  @Input() chatInfo?:Chat;
  @Output() CloseChatInfo= new EventEmitter<void>();
  status?:Promise<number>;
  protected isOpenEditMode=false;
  protected isOpenAddUserMode=false;
  constructor(protected signalRService:SignalRService, private chatService:ChatService, private authService:AuthService) {

  }
    addUserName:string="";
    ngOnInit(): void {
        // @ts-ignore
        this.signalRService.getUserStatus(this.chatInfo?.userViewModels?.map(x=>x.userName))
            .pipe(untilDestroyed(this)).subscribe(x=>{
              x.forEach(userStatus=>{
                  let user= this.chatInfo?.userViewModels?.find(user=>userStatus.userName==user.userName);
                  if(user){
                      user.status=userStatus.activityStatus;
                  }
              })

        });



    }
    addUser(){
        this.signalRService.addUserToChat(this.chatInfo?.name||"", this.AddUser?.userName||"")?.then(
            x=>{
                this.AddUser=undefined;
                this.addUserName="";
                this.isOpenAddUserMode=false;
            }
        );
    }
    editChat(){
        this.signalRService.editChat(this.chatInfo?.name||"", this.editName)?.then(
            x=>{
                this.isOpenEditMode=false;
            }
        );
    }
    protected AddUser?:User;
    findUser(){
        this.authService.getUserByName(this.addUserName).subscribe(x=> {
            if(x){
                this.AddUser = x;
            }
        });
    }
    private SetClickMenuItems(){
        this.clickMenuItems=[];

    }
    editName:string="";
    protected isDisplayContextMenu?: boolean;
    private ClickMenuItems = [
        {
            menuText: 'Add user',
            menuEvent: 'Handle add',
        },
        {
            menuText: 'Edit chat',
            menuEvent: 'Handle edit',
        },
        {
            menuText: 'Leave chat',
            menuEvent: 'Handle leave',
        },
        {
            menuText: 'Delete chat',
            menuEvent: 'Handle delete'
        }
    ];
    public clickMenuItems = [
        {
            menuText: 'Add user',
            menuEvent: 'Handle add',
        },
        {
            menuText: 'Edit chat',
            menuEvent: 'Handle edit',
        },
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
            case this.ClickMenuItems[0].menuEvent:
                console.log("Add user");
                this.isOpenAddUserMode=true;
                this.isDisplayContextMenu=false;
                break;
            case this.ClickMenuItems[1].menuEvent:
                console.log("Edit");
                this.isOpenEditMode=true;
                this.editName=this.chatInfo?.name||"";
                this.isDisplayContextMenu=false;
                break;
            case this.ClickMenuItems[2].menuEvent:
                console.log("leave");
                this.signalRService.leaveChat(this.chatInfo?.name||"")?.then(
                    x=>this.isDisplayContextMenu=false
                );
                break;
            case this.ClickMenuItems[3].menuEvent:
                console.log("delete");
                this.signalRService.deleteChat(this.chatInfo?.name||"")?.then(x=>{
                    this.isDisplayContextMenu=false
                })

                break;
        }
    }
}
