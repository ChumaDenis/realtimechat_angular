import { Injectable } from '@angular/core';
import { User } from '../components/Models/user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  endpoint: string = 'https://localhost:7068/api';
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) {

  }

  // Sign-up
  getChats(): Observable<any> {
    let api = `${this.endpoint}/Chat/chats?PageNumber=${1}&PageSize=${5}`;
    return this.http.get(api,{ headers: this.headers}).pipe(catchError(this.handleError));
  }
  getChat(name:string ): Observable<any> {
    let api = `${this.endpoint}/Chat/${name}`;
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
