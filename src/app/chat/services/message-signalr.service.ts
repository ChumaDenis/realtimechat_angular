import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/auth.service";
import {Subject} from "rxjs";
import {UserStatus} from "../../shared/Dtos/Auth/UserStatus";
import {Message} from "../messeges/DTOs/Message";

@Injectable({
  providedIn: 'any'
})
export class MessageSignalrService {
  private connectionUrl = 'https://localhost:7068/signalr';
  private hubConnection?: HubConnection;
  constructor(private http: HttpClient, public router: Router,private authService: AuthService) { }

  public joinUserToChat(chatName:string){
    return  this.hubConnection?.invoke(`JoinUser`, chatName).then()
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
  public reloadChatListener(){
    const subject=new Subject<string>()
    this.hubConnection?.on(`ChangeChat`, (data: string) => {
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
