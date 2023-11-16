import { Injectable } from '@angular/core';
import { User } from './Dtos/Auth/User';
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

export class AuthService {
  endpoint: string = 'https://localhost:7068/api';
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  currentUser?:User;

  constructor(private http: HttpClient, public router: Router) {}

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/Auth/register`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  // Sign-in
  signIn(user: User) {
    return this.http
        .post<any>(`${this.endpoint}/Auth/login`, user)
        .subscribe((res: any) => {
          localStorage.setItem('access_token', res.token);
          this.getUserProfile().subscribe((res) => {
            this.currentUser = res;

            localStorage.setItem('userName', this.currentUser?.userName||"");
            console.log(localStorage.getItem('userName'));
            this.router.navigate(['chats']);
          });
        });
  }

  editUser(user:User){
    return this.http
        .put<any>(`${this.endpoint}/Auth/edit`, user)
        .subscribe((res: any) => {
          this.signIn(user);
        });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
      localStorage.removeItem('userName');
    }
  }

  // User.ts profile
  getUserProfile(): Observable<any> {
    let api = `${this.endpoint}/Auth/myInfo`;
    //this.headers.append('Authorization', 'Bearer '+localStorage.getItem('access_token'))
    return this.http.get(api, { headers: this.headers }).pipe(

        map((res) => {
          console.log(res);
          return res || {};
        }),
        catchError(this.handleError)
    );
  }
  getUserByName(userName:string){
    let api = `${this.endpoint}/Auth/info?name=${userName}`;
    return this.http.get(api, { headers: this.headers }).pipe(catchError(this.handleError));
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
