import { Component } from '@angular/core';
import {ConfigService} from "../config/config.service";
import {ChatService} from "./chat.service";
import {ChatElement} from "./chatDtos/ChatElement";
import {PagedList} from "../shared/Dtos/PagedList";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {
    public chats:ChatElement[]=[
        ];
  constructor(private service:ChatService) {
    this.service.getChats().subscribe(x=>{
          if(x!=undefined)
            { // @ts-ignore
                (x as PagedList<ChatElement>).items.map(y=>this.chats.push(y));
            }
          console.log(this.chats);

        }
    );

  }




}
