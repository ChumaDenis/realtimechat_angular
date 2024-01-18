import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/auth.service';

@Injectable({
  providedIn: 'any',
})
export class AuthAdminGuard {
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
    if(this.authService.currentUser?.userRole?.find((x:string)=>x=="Admin")){
      this.router.navigate(['']);
    }
    return true;
  }
}