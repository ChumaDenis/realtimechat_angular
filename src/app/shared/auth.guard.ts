import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../shared/auth.service';
import {AppModule} from "../app.module";

@Injectable({
  providedIn: 'any',
})
export class AuthGuard {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ):
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
    if (this.authService.isLoggedIn !== true) {
      this.router.navigate(['log-in']);
    }
    return true;
  }
}
