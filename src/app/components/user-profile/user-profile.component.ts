import {Component, DestroyRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { User } from '../../shared/Dtos/User';
import {first} from "rxjs";
import {AvatarService} from "../../shared/avatar.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @Input() User?:User;
  protected userEdit?:User;
  @Output() CloseUserProfileEvent=new EventEmitter<any>();
  protected isEditMode:boolean=false;
  protected isDisplayContextMenu?: boolean;
  public clickMenuItems = [
    {
      menuText: 'Edit',
      menuEvent: 'Handle edit',
    },
    {
      menuText: 'Log out',
      menuEvent: 'Handle logout'
    }
  ];

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

  setEditUser(){
    this.userEdit=new User();
    this.userEdit.userName=this.User?.userName;
    this.userEdit.status=this.User?.status;
    this.userEdit.email=this.User?.email;
    this.userEdit.phoneNumber=this.User?.phoneNumber;
    this.userEdit.avatar=this.User?.avatar;
    this.userEdit.createDate=this.User?.createDate;
  }
  clearEditUser(){
    this.userEdit=undefined;
    this.isEditMode=false;
  }
  constructor(private avatarService:AvatarService,private authService:AuthService,
              private sanitaizer:DomSanitizer, private router:Router) {
  }

  ngOnDestroy(): void {
        console.log("OnDestroy");
    }
  protected avatar?:SafeUrl;
  ngOnInit() {
    console.log("OnInit")
    if(this.User?.avatar)
      this.downloadAvatar()
  }
  Edit(){
    // @ts-ignore
    this.authService.editUser(this.userEdit);
    this.clearEditUser();
    setTimeout(()=>{
      this.User=this.authService.currentUser
    }, 1000);
  }


  fileList?:File;
  downloadAvatar(){
    const avatarJson=JSON.parse(localStorage.getItem("userAvatar")||"");
    if(avatarJson && avatarJson.id==this.User?.avatar?.id){
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
        x.subscribe((y:any)=>{
          const avatarInfo={
            id:this.User?.avatar?.id,
            file:y
          };
          localStorage.setItem("userAvatar", JSON.stringify(avatarInfo))
        })
      })
    }

  }
  detectFiles(event:Event) {
    let files = (event.target as HTMLInputElement).files;
    if (files) {
      let check=true;
      this.fileList=files[0];
      this.sendMessage();
    }
  }
  protected sendMessage(){
    // @ts-ignore
    const formData= new FormData();
    formData.append("FormFile", this.fileList);
    this.avatarService.setAvatar(formData).pipe(first()).subscribe(x=>{
      console.log(x);
      this.downloadAvatar();
    });

  }
  protected Logout(){
    this.authService.doLogout();
  }
}
