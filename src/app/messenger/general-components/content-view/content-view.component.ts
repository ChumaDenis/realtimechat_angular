import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Content} from "../../../shared/Dtos/Content";
import {MessageService} from "../../chat/message.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {first} from "rxjs";
import {Message} from "../../../shared/Dtos/Message";

@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit{
  @Input() content?:Content[];
  @Input() currentContent?:Content;

  @Output() CloseViewEvent = new EventEmitter<any>()


  private currentIndex:number=0;
  protected hasPrevious=false;
  protected hasNext=false

  protected fileUrl?:SafeUrl;
  protected blobs:{ [id: number] : Blob; }={}
  constructor(private service:MessageService,private sanitaizer:DomSanitizer) {
  }
  ngOnInit(): void {
    this.SetIndex();
    this.LoadFile();
  }
  SetIndex(){
    // @ts-ignore
    this.currentIndex=this.content?.indexOf(this.currentContent);
    if(this.currentIndex>=0&&this.content?.length){
        this.hasPrevious=this.currentIndex!=0;
        this.hasNext=this.currentIndex<this.content?.length-1;
    }
  }
  GoToPrevious(){
    this.currentIndex-=1;
    this.currentContent=this.content?.at(this.currentIndex);
    this.SetIndex();
    this.LoadFile();
  }
  GoToNext(){
    this.currentIndex+=1;
    this.currentContent=this.content?.at(this.currentIndex);
    this.SetIndex();
    this.LoadFile();
  }
  LoadFile(){
    console.log(this.blobs);
    if(this.blobs[this.currentIndex]){
      let objectURL = URL.createObjectURL(this.blobs[this.currentIndex]);
      this.fileUrl= this.sanitaizer.bypassSecurityTrustUrl(objectURL);
    }
    else{
      this.service.downloadFile(this.currentContent?.id||"").pipe(first()).subscribe(file=>{
        this.blobs[this.currentIndex]=file;
        let objectURL = URL.createObjectURL(file);
        this.fileUrl= this.sanitaizer.bypassSecurityTrustUrl(objectURL);
      })
    }
  }
}
