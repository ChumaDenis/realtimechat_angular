import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {Subject, throwError} from "rxjs";
import {Message} from "../../chat/messeges/DTOs/Message";
import {AuthService} from "../../shared/auth.service";
import {UserStatus} from "../../shared/Dtos/Auth/UserStatus";
import {UnreadMessages} from "../../chat/DTOs/UnreadMessages";



@Injectable({
  providedIn: 'any'
})
export class SignalRService {
  private connectionUrl = 'https://localhost:7068/signalr';
  private hubConnection?: HubConnection;
  constructor(private http: HttpClient, public router: Router,private authService: AuthService) { }

  public addListenerForChats() {
    const subject=new Subject<Message>()
    this.hubConnection?.on(`LastMessage/Chat`, (data: Message) => {
      subject.next(data);
    })
    return subject;
  }
  public addListenerForUnreadMessages() {
    const subject=new Subject<Message>()
    this.hubConnection?.on(`UnreadMessages`, (data: UnreadMessages) => {
      subject.next(data);
    })
    return subject;
  }
  private connectToGroup(){
    this.hubConnection?.on(`UsersStatus`, (data) => {
      console.log(data)
    })
    this.hubConnection?.invoke('ConnectToGroup').then(x=>console.log(`connect to groups`));
  }

  public getUsersStatus(userNames:string[]){
    this.hubConnection?.invoke<any>("GetUsersStatus", userNames).then()
    const subject=new Subject<UserStatus[]>();
    this.hubConnection?.on("GetUsers",x=>{
      console.log(x)
      subject.next(x)

    })
    return subject;
  }


  public AddChatListener(){
    const subject=new Subject<string>()
    this.hubConnection?.on("AddChatInfo", x => {
      console.log(x);
      subject.next(x);
    })
    return subject;
  }
  public UpdateChatListener(){
    const subject=new Subject<any>()
    this.hubConnection?.on("UpdateChatInfo", (x:string, y:string) => {
      subject.next( {newName: x, oldName:y});
    })
    return subject;
  }
  public DeleteChatListener(){
    const subject=new Subject<string>()
    this.hubConnection?.on("DeleteChatsInfo", (x) => {
      subject.next(x);
    })
    return subject;
  }
  public createChat(chatName:string, description:string, isChat:boolean, privacy:boolean){
    const body={
      Name:chatName,
      Description:description,
      IsChat:isChat,
      Privacy:privacy
    }
    return  this.hubConnection?.invoke(`CreateChat`, body).then()
  }
  addUserToChat(chatName:string, userName:string){
    return  this.hubConnection?.invoke(`AddUser`, chatName, userName).then()
  }
  joinUserToChat(chatName:string){
    return  this.hubConnection?.invoke(`JoinUser`, chatName).then()
  }
  editChat(chatName:string, newChatName:string){
    const body={
      Name:newChatName
    }
    return this.hubConnection?.invoke(`UpdateChat`, body, chatName).then();
  }
  leaveChat(chatName:string){
    return  this.hubConnection?.invoke(`LeaveChat`, chatName).then();
  }
  removeUser(chatName:string, userName:string){
    return  this.hubConnection?.invoke(`RemoveUser`, chatName).then();
  }
  deleteChat(chatName:string){
    return  this.hubConnection?.invoke(`DeleteChat`, chatName).then();
  }
  public connect = () => {
    this.startConnection();
    return this.hubConnection
  }
  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection?.start()
        .then(() => {
          console.log('connection started');
          this.connectToGroup()
        })
        .catch((err) => console.log('error while establishing signalr connection: ' + err))
  }
  private getConnection(): HubConnection {
    const authToken = this.authService.getToken();
    return new HubConnectionBuilder()
        .withUrl(this.connectionUrl,{ accessTokenFactory: () => authToken||"" })
        .withAutomaticReconnect()
        .build();
  }
}
