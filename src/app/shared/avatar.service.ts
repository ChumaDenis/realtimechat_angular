import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  endpoint: string = 'https://localhost:7068/api';
  headers = new HttpHeaders().append('Content-Type', 'application/json');

  constructor(private http: HttpClient, public router: Router) {

  }
  setAvatar(avatar:FormData): Observable<any> {
    this.headers.append('Content-Type', 'application/json')
    let api = `${this.endpoint}/avatar/upload`;
    return this.http.post(api,avatar).pipe(catchError(this.handleError));
  }
  getAvatar(userName:string): Observable<any> {
    this.headers.append('Content-Type', 'application/json')
    let api = `${this.endpoint}/avatar/get?userName=${userName}`;
    return this.http.get(api).pipe(catchError(this.handleError));
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
