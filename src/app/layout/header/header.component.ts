import { Component } from '@angular/core';
import {AuthService} from "../../shared/auth.service";

@Component({
  selector: 'app-header',
  styleUrls:['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  userName:string=localStorage.getItem('userName')||"";
  constructor(public authService:AuthService) {
    console.log(this.userName);
  }
  logout(){
    this.authService.doLogout();
  }
}
