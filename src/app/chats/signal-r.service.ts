import { Injectable } from '@angular/core';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, Subject, throwError} from "rxjs";
import {Message} from "../shared/Dtos/Message";
import {Chat} from "./chatDtos/Chat";
import {ChatElement} from "./chatDtos/ChatElement";
import {AuthService} from "../shared/auth.service";



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
    this.hubConnection?.invoke('ConnectToGroup').then(x=>console.log(`connect to groups`));
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
