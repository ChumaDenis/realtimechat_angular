import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat} from "../../DTOs/Chat";
import {SignalRService} from "../../../chat-menu/services/signal-r.service";
import {first} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AuthService} from "../../../shared/auth.service";
import {User} from "../../../shared/Dtos/Auth/User";
@UntilDestroy()
@Component({
  selector: 'app-chatinfo',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent implements OnInit{
  @Input() chatInfo?:Chat;
  @Output() CloseChatInfo= new EventEmitter<void>();
  protected users:User[]=[];
  protected isOpenEditMode=false;
  protected isOpenAddUserMode=false;
  protected addUserName:string="";
  protected addUserModel?:User;
  protected editName:string="";
  protected isDisplayContextMenu?: boolean;

  constructor(protected signalRService:SignalRService,
              private authService:AuthService) {

  }

  ngOnInit(): void {
      this.SetSignalRListeners();
      this.SetClickMenuItems();
  }
  private SetSignalRListeners(){
      this.signalRService.getUsersStatus(this.chatInfo?.userViewModels?.map(x=>x.userName||"")||[])
          .pipe(untilDestroyed(this)).subscribe(x=>{
              let users:User[]=this.chatInfo?.userViewModels||[];
              x.forEach(userStatus=>{
                  let user= users.find(user=>userStatus.userName==user.userName);
                  if(user){
                    user.status=userStatus.activityStatus;
                  }
              })
              this.users=users;
          });
  }
  protected addUser(){
      this.signalRService.addUserToChat(this.chatInfo?.name||"", this.addUserModel?.userName||"")?.then(
          x=>{
              this.addUserModel=undefined;
              this.addUserName="";
              this.isOpenAddUserMode=false;
          });
  }
  protected editChat(){
      this.signalRService.editChat(this.chatInfo?.name||"", this.editName)?.then(
          x=>{
              this.isOpenEditMode=false;
          });
  }
  protected findUser(){
      this.authService.getUserByName(this.addUserName).subscribe(x=> {
          if(x){
              this.addUserModel = x;
          }
      });
  }
  private SetClickMenuItems(){
      this.clickMenuItems=[];
      this.authService.getUserProfile().pipe(first()).subscribe(x=>{
          const currentUserName=x?.userName;
          if(this.chatInfo?.chatOwner?.userName==currentUserName||!this.chatInfo?.isChat){
              this.clickMenuItems.push({
                  menuText: 'Add user',
                  menuEvent: 'Handle add',
              })
          }
          if(this.chatInfo?.chatOwner?.userName==currentUserName){
              this.clickMenuItems.push({
                  menuText: 'Edit chat',
                  menuEvent: 'Handle edit',
              })
          }
          if(this.chatInfo?.chatOwner?.userName!=currentUserName){
              this.clickMenuItems.push({
                  menuText: 'Leave chat',
                  menuEvent: 'Handle leave',
              },)
          }
          else{
              this.clickMenuItems.push({
                  menuText: 'Delete chat',
                  menuEvent: 'Handle delete'
              })
          }
      })

  }

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
  public clickMenuItems:{menuText:string, menuEvent:string}[] = [];
  protected handleMenuItemClick(event:Event) {
      // @ts-ignore
      switch (event.data.menuEvent) {
          case this.ClickMenuItems[0].menuEvent:
              this.isOpenAddUserMode=true;
              break;
          case this.ClickMenuItems[1].menuEvent:
              this.isOpenEditMode=true;
              this.editName=this.chatInfo?.name||"";
              break;
          case this.ClickMenuItems[2].menuEvent:
              this.signalRService.leaveChat(this.chatInfo?.name||"")?.then(
                  x=>this.isDisplayContextMenu=false
              );
              break;
          case this.ClickMenuItems[3].menuEvent:
              this.signalRService.deleteChat(this.chatInfo?.name||"")?.then(x=>{
                  this.isDisplayContextMenu=false
              })
              break;
          default:
              this.isDisplayContextMenu=false;
              break;
        }
    }
}
