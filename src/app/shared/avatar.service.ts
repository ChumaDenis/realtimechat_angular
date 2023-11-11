import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, Observer, throwError} from "rxjs";
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
    return this.http.get(api,{ responseType: 'blob' }).pipe(catchError(this.handleError));
  }
  convertBlobToBase64(blob: Blob) {
    return Observable.create((observer:Observer<any>) => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {

        observer.next(event.target.result);
        observer.complete();
      };

      reader.onerror = (event: any) => {
        observer.next(event.target.error.code);
        observer.complete();
      };
    });
  }


  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }
}
