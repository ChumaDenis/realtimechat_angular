import {Component, Input, OnInit} from '@angular/core';
import {first} from "rxjs";
import {User} from "../../shared/Dtos/Auth/User";
import {AvatarService} from "../../shared/avatar.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-userinfo-element',
  templateUrl: './userinfo-element.component.html',
  styleUrls: ['./userinfo-element.component.scss']
})
export class UserinfoElementComponent implements OnInit{
  @Input() userProfile?:User;
  protected avatar?:SafeUrl;
  protected statusName="";
  protected isOpenUserProfile:boolean=false;
  constructor(private avatarService:AvatarService,
              private sanitaizer:DomSanitizer) {
  }

  ngOnInit(): void {
    this.formatStatus();
    if(this.userProfile?.avatar)
      this.downloadAvatar();
  }

  private formatStatus(){
      switch (this.userProfile?.status){
        case 0:
          this.statusName="Online";
          break;
        case 1:
          this.statusName="Offline";
          break;
        case 2:
          this.statusName="Idle";
          break;
        case 3:
          this.statusName="DoNotDisturb";
          break;
        case 4:
          this.statusName="Invisible";
          break;
      }
  }
  private downloadAvatar(){
    const avatar=localStorage.getItem("userAvatar");
    let avatarJson:any="";
    if(avatar) avatarJson = JSON.parse(avatar);
    console.log(avatarJson);
    if(avatarJson!="" && avatarJson.id==this.userProfile?.avatar?.id){
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
        x.pipe(first()).subscribe((y:any)=>{
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
