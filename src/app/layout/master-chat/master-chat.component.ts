import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-master-chat',
  templateUrl: './master-chat.component.html',
  styleUrls: ['./master-chat.component.scss']
})
export class MasterChatComponent {
  constructor(private route:Router) {
    //this.route.navigate(["chats/string"]);
  }
  OpenChat(name:string){
    this.route.navigate([`chats/${name}`]);
  }
}
