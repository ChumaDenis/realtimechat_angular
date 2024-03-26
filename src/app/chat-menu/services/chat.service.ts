import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'any',
})
export class ChatService {
  endpoint: string = 'https://localhost:7068/api';
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) {

  }
  getAllChats(): Observable<any> {
    let api = `${this.endpoint}/Chat/allChats`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }

  getGeneralChatStats(date?:Date):Observable<any>{
    let api = `${this.endpoint}/Chat/chatStats`;
    if(date) api+=`?date=${date.toString()}`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  getChatStats(chatName:string, date?:Date):Observable<any>{
    let api = `${this.endpoint}/Chat/chatStats/${chatName}`;
    if(date) api+=`?date=${date.toString()}`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  getChats(): Observable<any> {
    let api = `${this.endpoint}/Chat/chats`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  getChat(name:string ): Observable<any> {
    let api = `${this.endpoint}/Chat/${name}`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  getPublicChat(): Observable<any> {
    let api = `${this.endpoint}/Chat/public-channels`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }


  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
