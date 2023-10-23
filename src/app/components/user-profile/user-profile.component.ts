import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { User } from '../Models/user';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  currentUser: User = {};

  constructor(
      public authService: AuthService,
      private actRoute: ActivatedRoute
  ) {
    this.authService.getUserProfile().subscribe((res) => {

      this.currentUser = res as User;
    });
  }

  ngOnInit() {}
}
