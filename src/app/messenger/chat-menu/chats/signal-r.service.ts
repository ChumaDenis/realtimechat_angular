import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {Message} from "../../../shared/Dtos/Message";
import {Chat} from "../../chat/DTOs/Chat";
import {ChatElement} from "../../chat/DTOs/ChatElement";
import {AuthService} from "../../../shared/auth.service";
import {User} from "../../../shared/Dtos/User";
import {UserStatus} from "../../../shared/Dtos/UserStatus";
import {catchError} from "rxjs/operators";



@Injectable({
  providedIn: 'root'
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
  private connectToGroup(){
    this.hubConnection?.on(`UsersStatus`, (data) => {
      console.log(data)
    })
    this.hubConnection?.invoke('ConnectToGroup').then(x=>console.log(`connect to groups`));
  }


  public getUserStatus(userNames:string[]){
      this.hubConnection?.invoke<any>("GetUsersStatus", userNames).then()
      const subject=new Subject<UserStatus[]>();
      this.hubConnection?.on("GetUsers",x=>{
          console.log(x)
        subject.next(x)

      })
      return subject;
  }

  public createMessageListener(chatName:string){
    const subject=new Subject<Message>()
    this.hubConnection?.on(`CreateMessage/Chat/${chatName}`, (data: Message) => {
      subject.next(data);
    })
    return subject;
  }
  public updateMessageListener(chatName:string) {
      const subject=new Subject<Message>()
      this.hubConnection?.on(`UpdateMessage/Chat${chatName}`, (data: Message) => {
        subject.next(data)
      })
      return subject;
  }
  public deleteMessageListener(){
    const subject=new Subject<Message>()
    this.hubConnection?.on(`DeleteMessage/Chat`, (data: Message) => {
      subject.next(data);
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
  public createChat(chatName:string){
    const body={
      Name:chatName
    }
    return  this.hubConnection?.invoke(`CreateChat`, body).then()
  }
  addUserToChat(chatName:string, userName:string){
    return  this.hubConnection?.invoke(`AddUser`, chatName, userName).then()
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

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
