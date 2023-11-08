import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/auth.service";
import {Chat} from "../../chat/DTOs/Chat";

@Component({
  selector: 'app-chatinfo-element',
  templateUrl: './chatinfo-element.component.html',
  styleUrls: ['./chatinfo-element.component.scss']
})
export class ChatinfoElementComponent implements OnInit{
  @Input() ChatInfo?:Chat;
  protected ChatInfoIsOpen=false;
  constructor() {
  }

  ngOnInit(): void {
    setTimeout(()=>{console.log(this.ChatInfo?.userViewModels)}, 100)
  }
  OpenChatInfo(){
    this.ChatInfoIsOpen=true;
  }

}
