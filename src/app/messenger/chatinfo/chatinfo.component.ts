import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat} from "../chat/DTOs/Chat";
import {SignalRService} from "../chat-menu/chats/signal-r.service";
import {first, from, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
@UntilDestroy()
@Component({
  selector: 'app-chatinfo',
  templateUrl: './chatinfo.component.html',
  styleUrls: ['./chatinfo.component.scss']
})
export class ChatinfoComponent implements OnInit{
  @Input() chatInfo?:Chat;
  @Output() CloseChatInfo= new EventEmitter<void>();
  status?:Promise<number>;

  constructor(protected signalRService:SignalRService) {

  }

    ngOnInit(): void {
        // @ts-ignore
        this.signalRService.getUserStatus(this.chatInfo?.userViewModels?.map(x=>x.userName))
            .pipe(untilDestroyed(this)).subscribe(x=>{
              x.forEach(userStatus=>{
                  let user= this.chatInfo?.userViewModels?.find(user=>userStatus.userName==user.userName);
                  if(user){
                      user.status=userStatus.activityStatus;
                  }
              })

        });
    }

}
