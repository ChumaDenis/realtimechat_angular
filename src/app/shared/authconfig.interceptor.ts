import { Injectable } from "@angular/core";
import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from "@angular/common/http";
import { AuthService } from "./auth.service";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router:Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        req = req.clone({
            setHeaders: {
                Authorization: "Bearer " + authToken
            }
        });
        return next.handle(req).pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                    switch (error.status){
                        case 401:
                            this.router.navigate(["log-in"]);
                            break;
                        case 403:
                            this.router.navigate([""]);
                            break;
                    }
                } else {
                    // server-side error
                    errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                    switch (error.status){
                        case 401:
                            this.router.navigate(["log-in"]);
                            break;
                        case 403:
                        case 404:
                            this.router.navigate([""]);
                            break;
                    }
                }
                console.log(errorMessage);
                return throwError(errorMessage);
            })
        );
    }
}
