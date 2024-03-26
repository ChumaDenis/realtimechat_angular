import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../shared/Dtos/Auth/User';
import {first} from "rxjs";
import {AvatarService} from "../../shared/avatar.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit{
  @Input() User?:User;
  @Output() CloseUserProfileEvent=new EventEmitter<any>();

  protected avatar?:SafeUrl;
  private avatarFile?:File;

  protected userEdit?:User;

  protected isOwner:boolean=false;
  protected isEditMode:boolean=false;

  protected isDisplayContextMenu?: boolean;
  public readonly clickMenuItems = [
    {
      menuText: 'Edit',
      menuEvent: 'Handle edit',
    },
    {
      menuText: 'Log out',
      menuEvent: 'Handle logout'
    }
  ];

  constructor(private avatarService:AvatarService,
              private authService:AuthService,
              private sanitaizer:DomSanitizer) {}


  ngOnInit() {
    this.isOwner=localStorage.getItem("userName")==this.User?.userName;
    if(this.User?.avatar)
      this.downloadAvatar()
  }
  protected Edit(){
    // @ts-ignore
    this.authService.editUser(this.userEdit);
    this.clearEditUser();
    setTimeout(()=>{
      this.User=this.authService.currentUser
    }, 1000);
  }

  protected detectFiles(event:Event) {
    let files = (event.target as HTMLInputElement).files;
    if (files) {
      let check=true;
      this.avatarFile=files[0];
      this.setAvatar();
    }
  }
  protected setAvatar(){
    // @ts-ignore
    const formData= new FormData();
    formData.append("FormFile", this.avatarFile);
    this.avatarService.setAvatar(formData).pipe(first()).subscribe(x=>{
      console.log(x);
      this.downloadAvatar();
    });

  }
  protected Logout(){
    this.authService.doLogout();
  }

  private downloadAvatar(){
    const avatar=localStorage.getItem("userAvatar");
    let avatarJson:any="";
    if(avatar) avatarJson = JSON.parse(avatar);

    if(avatarJson!="" && avatarJson.id==this.User?.avatar?.id){
      fetch(avatarJson.file).then(x=>{
        x.blob().then((avatar)=> {
          let objectURL = URL.createObjectURL(avatar);
          this.avatar= this.sanitaizer.bypassSecurityTrustUrl(objectURL);
        });
      })
    }
    else{
      this.avatarService.getAvatar(this.User?.userName||"").pipe().subscribe(file=>{
        let objectURL = URL.createObjectURL(file);
        this.avatar= this.sanitaizer.bypassSecurityTrustUrl(objectURL);
        let x=this.avatarService.convertBlobToBase64(file);
        x.pipe(first()).subscribe((y:any)=>{
          const avatarInfo={
            id:this.User?.avatar?.id,
            file:y
          };
          localStorage.setItem("userAvatar", JSON.stringify(avatarInfo))
        })
      })
    }

  }

  protected handleMenuItemClick(event:Event) {
    // @ts-ignore
    switch (event.data.menuEvent) {
      case this.clickMenuItems[0].menuEvent:
        this.setEditUser();
        this.isEditMode=true;
        break;
      case this.clickMenuItems[1].menuEvent:
        this.authService.doLogout();
        break;
    }
  }

  private setEditUser(){
    this.userEdit=new User();
    this.userEdit.userName=this.User?.userName;
    this.userEdit.status=this.User?.status;
    this.userEdit.email=this.User?.email;
    this.userEdit.phoneNumber=this.User?.phoneNumber;
    this.userEdit.avatar=this.User?.avatar;
    this.userEdit.createDate=this.User?.createDate;
  }
  private clearEditUser(){
    this.userEdit=undefined;
    this.isEditMode=false;
  }
}
