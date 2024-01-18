import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Content} from "../../DTOs/Content";

@Component({
  selector: 'app-content-element',
  templateUrl: './content-element.component.html',
  styleUrls: ['./content-element.component.scss']
})
export class ContentElementComponent {
  @Input() content?:Content;
  @Output() ContentOpenEvent = new EventEmitter<Content>();

}
