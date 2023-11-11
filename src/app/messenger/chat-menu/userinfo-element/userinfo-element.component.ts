import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {first, Observable, Observer} from "rxjs";
import {User} from "../../../shared/Dtos/User";
import {AvatarService} from "../../../shared/avatar.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {SignalRService} from "../chats/signal-r.service";

@Component({
  selector: 'app-userinfo-element',
  templateUrl: './userinfo-element.component.html',
  styleUrls: ['./userinfo-element.component.scss']
})
export class UserinfoElementComponent implements OnInit{
  @Input() userProfile?:User;
  protected isOpenUserProfile:boolean=false;
  constructor(private authService:AuthService,private avatarService:AvatarService,private sanitaizer:DomSanitizer,
              private signalRService:SignalRService) {
  }

  ngOnInit(): void {
    if(this.userProfile?.avatar)
      this.downloadAvatar();
  }
  protected avatar?:SafeUrl;

  downloadAvatar(){
    const avatarJson=JSON.parse(localStorage.getItem("userAvatar")||"");
    console.log(avatarJson);
    if(!avatarJson && avatarJson.id==this.userProfile?.avatar?.id){
      fetch(avatarJson.file).then(x=>{
        x.blob().then((avatar)=> {
          console.log(avatar);
          let objectURL = URL.createObjectURL(avatar);
          this.avatar= this.sanitaizer.bypassSecurityTrustUrl(objectURL);

        });
      })
    }
    else{
      this.avatarService.getAvatar(this.userProfile?.userName||"").pipe().subscribe(file=>{
        let objectURL = URL.createObjectURL(file);
        this.avatar= this.sanitaizer.bypassSecurityTrustUrl(objectURL);
        let x=this.avatarService.convertBlobToBase64(file);
        x.subscribe((y:any)=>{
          const avatarInfo={
            id:this.userProfile?.avatar?.id,
            file:`${y}`
          };
          localStorage.setItem("userAvatar", JSON.stringify(avatarInfo))
        })
      })
    }
  }




}
