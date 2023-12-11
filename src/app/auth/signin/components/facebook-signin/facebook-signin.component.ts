import {Component, EventEmitter, OnInit, Output} from '@angular/core';
declare var FB: any;
@Component({
  selector: 'app-facebook-signin',
  templateUrl: './facebook-signin.component.html',
  styleUrls: ['./facebook-signin.component.scss']
})
export class FacebookSigninComponent implements OnInit{
    @Output() loginWithFacebook: EventEmitter<any> = new EventEmitter<any>();
    ngOnInit(): void {
      (window as any).fbAsyncInit = function() {
        FB.init({
          appId      : '731402765515559',
          cookie     : true,
          xfbml      : true,
          version    : 'v3.1'
        });
        FB.AppEvents.logPageView();
      };

      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        // @ts-ignore
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        // @ts-ignore
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
    protected submitLogin(){
      // @ts-ignore
      FB.login((response)=>
      {
        if (response.authResponse)
        {
          this.loginWithFacebook.emit(response.authResponse);
        }
      });
    }
}
