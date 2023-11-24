import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
@Injectable({
  providedIn: 'any'
})
export class MessageService {
  endpoint: string = 'https://localhost:7068/api';
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  constructor(private http: HttpClient, public router: Router) {
  }
  currentMessagePage:number=0;
  currentChat:string="";
  public getMessages(name:string ): Observable<any> {
    this.headers.append('Content-Type', 'application/json')
    if(this.currentChat!=name){
      this.currentMessagePage=0;
    }
    this.currentChat=name;
    this.currentMessagePage+=1;
    let api = `${this.endpoint}/Message/get?chatName=${name}&PageNumber=${this.currentMessagePage}&PageSize=10`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  public sendMessage(message:FormData){
    let api = `${this.endpoint}/Message/create`;
    return this.http.post(api, message).pipe(catchError(this.handleError));
  }
  public updateMessage(message:FormData){
    let api = `${this.endpoint}/Message/update`;
    return this.http.put(api, message).pipe(catchError(this.handleError));
  }
  public deleteMessage(name:string, messageId:string){
    this.headers.append('Content-Type', 'application/json')
    let api = `${this.endpoint}/Message/delete?chatName=${name}&messageId=${messageId}`;
    return this.http.delete(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  public downloadFile(contentId:string){
      this.headers.append('Content-Type', 'application/json')
      let api = `${this.endpoint}/content/${contentId}`;
      return this.http.get(api,{ responseType: 'blob' }).pipe(catchError(this.handleError));
  }
  public forwardMessage(messageId:string, chatName:string){
    let api = `${this.endpoint}/Message/forward?messageId=${messageId}&chatName=${chatName}`;
    return this.http.post(api, {}).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
