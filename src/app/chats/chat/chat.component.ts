import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from "../../shared/Dtos/Message";
import {Chat} from "../chatDtos/Chat";
import {ChatService} from "../chat.service";
import {MessageService} from "./message.service";
import {ActivatedRoute} from "@angular/router";
import {FormGroup, FormBuilder} from "@angular/forms";
import {first, Subject, takeUntil} from "rxjs";
import {SignalRService} from "../signal-r.service";




@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy{
  // @ts-ignore
  @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any>;
  // @ts-ignore
  protected sendMessageForm: FormGroup;
  protected IsScrolled=true;
  protected Messages?:Message[];


  protected isUpdateMessage:boolean=false;
  protected UpdateMessage?:Message;
  protected fileList:File[]=[];
  private ChatInfo?:Chat;
  private subject=new Subject<void>()

  constructor(
      public fb: FormBuilder,
      private chatService:ChatService,
      private messageService:MessageService,
      private route: ActivatedRoute,
      private signalR:SignalRService) {

    this.route.params.pipe(first()).subscribe(p=>{
      this.chatService.getChat(p.name).pipe(first()).subscribe(data=>{
        this.ChatInfo=data;
        localStorage.setItem("currentChat",data?.name||"");
        localStorage.setItem("currentChatOwner",data?.chatOwner?.userName||"");

        this.messageService.getMessages(data?.name||"").pipe(first()).subscribe(messages=>{
          this.Messages=messages.items;
          this.SetSignalR();
          this.ScrollToBottom();
        })
      })
    })
  }
  ngOnInit(): void {
      console.log(this.ChatInfo?.name);
      this.sendMessageForm = this.fb.group({
          TextContent: ['']
      })
  }
  ngOnDestroy(): void {
      this.subject.next();
      this.subject.complete();
      console.log("destroy")
      localStorage.removeItem("currentChat");
      localStorage.removeItem("currentChatOwner");
  }
  private SetSignalR(){
      this.signalR.connect();

      this.signalR.createMessageListener(this.ChatInfo?.name||"")
          .pipe(takeUntil(this.subject)).subscribe(data=>{
              this.Messages?.push(data);
          });

      this.signalR.updateMessageListener(this.ChatInfo?.name||"")
          .pipe(takeUntil(this.subject)).subscribe(data=>{
              let message= this.Messages?.find(x=>x.id==data.id)
              if(message){
                  message.contentFiles=data.contentFiles;
                  message.textContent=data.textContent;
              }
          });

      this.signalR.deleteMessageListener()
          .pipe(takeUntil(this.subject)).subscribe(x=>{
              this.Messages= this.Messages?.filter(m=>m.id!=x);
          })
  }

  protected ScrollToBottom(){
      console.log(this.scroll.nativeElement.scrollTop);
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
      this.IsScrolled=false;
  }



  protected onMessageChange(message:Message) {
      this.isUpdateMessage=true;
      this.UpdateMessage=message;
      this.sendMessageForm.patchValue({TextContent:message.textContent||""});

      message.contentFiles?.map(content=>{
          this.messageService.downloadFile(content.id||"").pipe(first())
              .subscribe(blob=>{
                  this.fileList.push(new File([blob], content.fileName||""));
              })
      });
  }

  detectFiles(event:Event) {
      let files = (event.target as HTMLInputElement).files;
      if (files) {
        // @ts-ignore
          this.formData=new FormData();
          for (let i = 0; i < files.length&&i<3; i++) {
              let check=true;
              this.fileList.map(t=>{
                  // @ts-ignore
                  if(files?.item(i).name == t.name)
                      check=false;
              })
              if(check){
                  // @ts-ignore
                  this.fileList.push(files.item(i));
              }
          }
      }
  }
  protected DeleteFile(fileName:string){
      this.fileList=this.fileList.filter(x=>x.name!=fileName);
  }

  protected sendMessage(){
      // @ts-ignore
      const formData= new FormData();
      Object.keys(this.sendMessageForm.controls).forEach(formControlName => {
        formData.append(formControlName,  this.sendMessageForm.get(formControlName)?.value);
      });
      formData.append("OwnerName", this.ChatInfo?.name);
      if(this.fileList.length>0){
          for (let i = 0; i < this.fileList.length; i++) {
              formData.append("Files", this.fileList[i]);
          }
      }
      if(this.isUpdateMessage)
      {
          formData.append('Id', this.UpdateMessage?.id);
          this.messageService.updateMessage(formData).pipe(first()).subscribe(x=>{
              this.clearForm();
              this.ScrollToBottom();
          });
      }
      else{
          this.messageService.sendMessage(formData).pipe(first()).subscribe(x=>{
              this.clearForm();
              this.ScrollToBottom();
          });
      }
  }
  private clearForm(){
      this.UpdateMessage=undefined;
      this.isUpdateMessage=false;
      this.sendMessageForm.patchValue({TextContent:""});
      this.fileList=[];
  }
  protected readonly onscroll = onscroll;
}
