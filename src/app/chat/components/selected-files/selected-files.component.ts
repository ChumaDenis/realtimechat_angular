import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-selected-files',
  templateUrl: './selected-files.component.html',
  styleUrls: ['./selected-files.component.scss']
})
export class SelectedFilesComponent {
  @Input() file?:string;
  @Output() DeleteFileEvent = new EventEmitter<string>()
}
