import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Message} from "./messeges/DTOs/Message";
import {Chat} from "./DTOs/Chat";
import {ChatService} from "../chat-menu/services/chat.service";
import {MessageService} from "./services/message.service";
import {ActivatedRoute} from "@angular/router";
import {FormGroup, FormBuilder} from "@angular/forms";
import {first, Subject, takeUntil} from "rxjs";
import {MessageSignalrService} from "./services/message-signalr.service";
import {PagedList} from "../shared/Dtos/PagedList";
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
  protected Messages?:Message[];
  protected fileList:File[]=[];
  protected ChatInfo?:Chat;

  protected isReplyMessage:boolean=false;
  protected isUpdateMessage:boolean=false;
  protected IsScrolled=true;
  protected hasNextPages:boolean=false;

  protected UpdateMessage?:Message;
  protected replyMessage?: Message;
  private subject=new Subject<void>();
  constructor(
      public fb: FormBuilder,
      private chatService:ChatService,
      private messageService:MessageService,
      private route: ActivatedRoute,
      private signalR:MessageSignalrService) {

      this.route.params.pipe(takeUntil(this.subject)).subscribe(p=>{
          this.chatService.getChat(p.name).pipe(first()).subscribe(data=>{
              this.ChatInfo=data;
              localStorage.setItem("currentChat",data?.name||"");
              localStorage.setItem("currentChatOwner",data?.chatOwner?.userName||"");
              this.messageService.getMessages(data?.name||"").pipe(first()).subscribe(messages=>{
                  console.log(messages)
                  this.Messages=messages.items;
                  this.SetSignalRListeners();
                  this.hasNextPages=messages.hasNext;
                  this.IsScrolled=false;
              })
          })
      })
  }



  ngOnInit(): void {
      this.sendMessageForm = this.fb.group({
          TextContent: [''],
          SendTime:undefined
      })

  }
  ngOnDestroy(): void {
      this.subject.next();
      this.subject.complete();
      localStorage.removeItem("currentChat");
      localStorage.removeItem("currentChatOwner");
  }
  protected JoinChat(){
      this.signalR.joinUserToChat(this.ChatInfo?.name||"")?.then();
  }
  private LoadChatInfo(name:string){
      this.chatService.getChat(name).pipe(first()).subscribe(data=>{
          this.ChatInfo=data;
      })
  }
  private SetSignalRListeners(){
      this.signalR.connect();

      this.signalR.createMessageListener(this.ChatInfo?.name||"")
          .pipe(takeUntil(this.subject)).subscribe(data=>{
              if(data.chatName==this.ChatInfo?.name && !this.Messages?.find(x=>x.id==data.id))
                this.Messages?.unshift(data);
          });

      this.signalR.updateMessageListener(this.ChatInfo?.name||"")
          .pipe(takeUntil(this.subject)).subscribe(data=>{
              if(data.chatName==this.ChatInfo?.name){
                  let message= this.Messages?.find(x=>x.id==data.id)
                  if(message){
                      message.contentFiles=data.contentFiles;
                      message.textContent=data.textContent;
                  }
              }

          });

      this.signalR.deleteMessageListener()
          .pipe(takeUntil(this.subject)).subscribe(data=>{
              this.Messages= this.Messages?.filter(m=>m.id!=data);
          })

      this.signalR.reloadChatListener()
          .pipe(takeUntil(this.subject)).subscribe(chatName=>{
            if(chatName==this.ChatInfo?.name){
                this.LoadChatInfo(chatName);
            }
      })
  }

  protected scrollToBottom(){
      console.log(this.scroll.nativeElement.scrollTop);
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
      this.IsScrolled=false;
  }

  protected onScroll(){
      if(-this.scroll.nativeElement.scrollTop+this.scroll.nativeElement.offsetHeight+50>=this.scroll.nativeElement.scrollHeight
          &&this.hasNextPages){
          this.messageService.getMessages(this.ChatInfo?.name||"").pipe(first()).subscribe((x:PagedList<Message>)=>{
              this.hasNextPages=x.hasNext||false;
              x.items?.forEach(y=>this.Messages?.push(y));
          });
      }
  }

  protected onMessageChange(message:Message) {
      this.isUpdateMessage=true;
      this.isReplyMessage=false;
      this.replyMessage=undefined;
      this.UpdateMessage=message;
      this.sendMessageForm.patchValue({TextContent:message.textContent||""});
      this.CloseReply();
      message.contentFiles?.map(content=>{
          this.messageService.downloadFile(content.id||"").pipe(first())
              .subscribe(blob=>{
                  this.fileList.push(new File([blob], content.fileName||""));
              })
      });
  }

  protected onMessageReply(message:Message){
    this.isReplyMessage=true;
    this.replyMessage=message;
  }

  protected detectFiles(event:Event) {
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
      if(this.sendMessageForm.get("TextContent")?.value!=""||this.fileList.length!=0){
          // @ts-ignore
          const formData= new FormData();
          formData.append("TextContent",  this.sendMessageForm.get("TextContent")?.value);
          if(this.sendMessageForm.get("SendTime")?.value &&this.parseDateString(this.sendMessageForm.get("SendTime")?.value).getTime()>Date.now()){
              formData.append("SendTime", this.sendMessageForm.get("SendTime")?.value);
          }

          formData.append("OwnerName", this.ChatInfo?.name);
          if(this.fileList.length>0){
              for (let i = 0; i < this.fileList.length; i++) {
                  formData.append("Files", this.fileList[i]);
              }
          }

          if(this.isReplyMessage){
              formData.append("ReplyMessageId", this.replyMessage?.id);
          }

          if(this.isUpdateMessage) {
              formData.append('Id', this.UpdateMessage?.id);
              this.messageService.updateMessage(formData).pipe(first()).subscribe(x=>{
                  this.clearForm();
                  this.scrollToBottom();
              });
          }
          else{
              this.messageService.sendMessage(formData).pipe(first()).subscribe(x=>{
                  this.clearForm();
                  this.scrollToBottom();
              });
          }
      }
  }
  protected clearForm(){
      this.UpdateMessage=undefined;
      this.isUpdateMessage=false;
      this.isReplyMessage=false;
      this.replyMessage=undefined;
      this.sendMessageForm.patchValue({TextContent:""});
      this.fileList=[];
      this.sendMessageForm.patchValue({SendTime:undefined})
  }
  protected CloseReply(){
      this.isReplyMessage=false;
      this.replyMessage=undefined;
  }

  private parseDateString(date:string): Date {
      date = date.replace('T','-');
      var parts = date.split('-');
      var timeParts = parts[3].split(':');
      // @ts-ignore
      return new Date(parts[0], parts[1]-1, parts[2], timeParts[0], timeParts[1]);
  }
}
