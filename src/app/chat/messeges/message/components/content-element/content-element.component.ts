import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Content} from "../../../DTOs/Content";
import {Message} from "../../../DTOs/Message";

@Component({
  selector: 'app-content-element',
  templateUrl: './content-element.component.html',
  styleUrls: ['./content-element.component.scss']
})
export class ContentElementComponent {
  @Input() content?:Content;
  @Output() ContentOpenEvent = new EventEmitter<Content>();
}
