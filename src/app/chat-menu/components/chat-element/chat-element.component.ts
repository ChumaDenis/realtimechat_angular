import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatElement} from "../../../chat/DTOs/ChatElement";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-element',
  templateUrl: './chat-element.component.html',
  styleUrls: ['./chat-element.component.scss']
})
export class ChatElementComponent implements OnInit {
  @Input() chat:ChatElement=new ChatElement();
  @Output() name=new EventEmitter<string>();
  constructor(private router:Router) {
  }
  ngOnInit(): void {
  }
  protected OnClick(){
    if(this.chat.unreadMessages?.unreadMessage)
      this.chat.unreadMessages.unreadMessage=0;
    this.router.navigate([`/${this.chat.name}`]);
  }
}
