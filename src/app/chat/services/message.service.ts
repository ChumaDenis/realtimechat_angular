import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  @Injectable({
    providedIn: 'root',
  })
  endpoint: string = 'https://localhost:7068/api';
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  constructor(private http: HttpClient, public router: Router) {
  }
  getMessages(name:string ): Observable<any> {
    this.headers.append('Content-Type', 'application/json')
    let api = `${this.endpoint}/ChatMessage/get?chatName=${name}&PageNumber=1&PageSize=20`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  sendMessage(message:FormData){
    let api = `${this.endpoint}/ChatMessage/create`;
    return this.http.post(api, message).pipe(catchError(this.handleError));
  }
  updateMessage(message:FormData){
    let api = `${this.endpoint}/ChatMessage/update`;
    return this.http.put(api, message).pipe(catchError(this.handleError));
  }
  deleteMessage(name:string, messageId:string){
    this.headers.append('Content-Type', 'application/json')
    let api = `${this.endpoint}/ChatMessage/delete?chatName=${name}&messageId=${messageId}`;
    return this.http.delete(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  downloadFile(contentId:string){
      this.headers.append('Content-Type', 'application/json')
      let api = `${this.endpoint}/content/${contentId}`;
      return this.http.get(api,{ responseType: 'blob' }).pipe(catchError(this.handleError));
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
