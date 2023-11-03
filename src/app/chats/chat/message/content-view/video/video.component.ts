import {Component, Input} from '@angular/core';
import {SafeUrl} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {
  @Input() VideoUrl?:SafeUrl;
  constructor() {
  }
}
