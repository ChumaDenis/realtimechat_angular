import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatElement} from "../../../chat/DTOs/ChatElement";
import {ChatService} from "../../chat.service";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {SignalRService} from "../../signal-r.service";

@Component({
  selector: 'app-chat-element',
  templateUrl: './chat-element.component.html',
  styleUrls: ['./chat-element.component.scss']
})
export class ChatElementComponent implements OnInit {
  @Input() chat:ChatElement=new ChatElement();
  @Output() name=new EventEmitter<string>();
  constructor(private service:ChatService, private router:Router) {
  }
  click(){
    this.router.navigate([`/${this.chat.name}`]);
  }
  ngOnInit(): void {
  }

}
