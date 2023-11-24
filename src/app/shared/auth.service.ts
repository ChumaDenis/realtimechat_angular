import { Injectable } from '@angular/core';
import { User } from './Dtos/Auth/User';
import {first, Observable, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import {FacebookResponce} from "./Dtos/Auth/FacebookResponce";
import {SocialUser} from "angularx-social-login";
import {SocialAuthService} from "@abacritt/angularx-social-login";

@Injectable({
  providedIn: 'any',
})

export class AuthService {
  endpoint: string = 'https://localhost:7068/api';
  headers = new HttpHeaders().append('Content-Type', 'application/json');
  currentUser?:User;

  constructor(private http: HttpClient, public router: Router,private authService: SocialAuthService) {}

  // Sign-up
  public signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/Auth/register`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  public signIn(user: User) {
    return this.http
        .post<any>(`${this.endpoint}/Auth/login`, user)
        .pipe(first())
        .subscribe((res: any) => {
          localStorage.setItem('access_token', res.token);
          this.getUserProfile().subscribe((res) => {
            this.currentUser = res;
            localStorage.setItem('userName', this.currentUser?.userName||"");
            this.router.navigate(['']);
          });
        });
  }
  public signInWithFacebook(facebookResponce:FacebookResponce) {
    console.log(facebookResponce.accessToken);
    return this.http
      .post<any>(`${this.endpoint}/Auth/login-facebook?access=${facebookResponce.accessToken}`, {})
      .pipe(first())
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.getUserProfile().subscribe((res) => {
          this.currentUser = res;
          localStorage.setItem('userName', this.currentUser?.userName||"");
          this.router.navigate(['']);
        });
      });
  }

  public signInWithGoogle(responce:SocialUser) {
    console.log(responce);
    return this.http
        .post<any>(`${this.endpoint}/Auth/login-google?access=${responce.idToken}`, {})
        .pipe(first())
        .subscribe((res: any) => {
          localStorage.setItem('access_token', res.token);
          this.getUserProfile().subscribe((res) => {
            this.currentUser = res;
            localStorage.setItem('userName', this.currentUser?.userName||"");
            this.router.navigate(['']);
          });
        });
  }
  public editUser(user:User){
    return this.http
        .put<any>(`${this.endpoint}/Auth/edit`, user)
        .pipe(first())
        .subscribe((res: any) => {
          this.signIn(user);
        });
  }

  public getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  public doLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userName');
    localStorage.removeItem("userAvatar");
    this.authService.signOut();
    this.router.navigate(['log-in']);
  }

  // User.ts profile
  public getUserProfile(): Observable<any> {
    let api = `${this.endpoint}/Auth/myInfo`;
    return this.http.get(api, { headers: this.headers }).pipe(
        map((res) => {
          return res || {};
        }),
        catchError(this.handleError)
    );
  }
  protected getUserByName(userName:string){
    let api = `${this.endpoint}/Auth/info?name=${userName}`;
    return this.http.get(api, { headers: this.headers }).pipe(catchError(this.handleError));
  }
  // Error
  private handleError(error: HttpErrorResponse) {
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
