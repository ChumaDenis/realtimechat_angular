import {Component, OnInit} from '@angular/core';
import {ChartConfiguration} from 'chart.js';
import {ChatService} from "../chat-menu/services/chat.service";
import {ChatStats} from "./Dtos/ChatStats";
import {first} from "rxjs";
import {Chart} from "./Dtos/Chart";
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit{
  private Chats?:ChatStats[];
  protected VisibleChats?:ChatStats[];
  protected Charts:Chart[]=[];
  constructor(private chatservice:ChatService) {
  }
  protected chartDatasets: ChartConfiguration<'line'>['data']['datasets'] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' }
  ];
    ngOnInit(): void {
        this.chatservice.getAllChats().pipe(first()).subscribe(x=>{
          console.log(x);
          this.Chats=x;
          this.VisibleChats=x;
        });
        this.chatservice.getGeneralChatStats().pipe(first()).subscribe((x:Chart)=>{
          this.Charts?.push(x);
        });
    }

    protected OnChangeFilter(){
      let charts:Chart[]=[]
      this.Charts.forEach(chart=>{
        if(chart.chatName!="General")
          this.chatservice.getChatStats(chart.chatName??'', this.dateFilter).pipe(first()).subscribe((x:Chart)=>{
            charts?.push(x);
          });
        else
          this.chatservice.getGeneralChatStats(this.dateFilter).pipe(first()).subscribe((x:Chart)=>{
            this.Charts?.push(x);
          });
      })
      this.Charts=charts;
    }
    private GetChatChart(chatName:string){
      this.chatservice.getChatStats(chatName, this.dateFilter).pipe(first()).subscribe((x:Chart)=>{
        this.Charts?.push(x);
      });
    }
    private RemoveChat(chatName:string){
      this.Charts=this.Charts.filter(x=>x.chatName!=chatName);
    }
  protected InitChartDataset(charts:Chart[]):ChartConfiguration<'line'>['data']['datasets']{
      let chartDatasets: ChartConfiguration<'line'>['data']['datasets'] = []
      charts?.forEach(x=>{
        chartDatasets.push({data:x.messagePerHour??[], label:x.chatName})
      })
      return chartDatasets;
  }

  protected onCheckboxChange($event:Event, chatName:string) {
    // @ts-ignore
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    if(isChecked){
      this.GetChatChart(chatName);
    }
    else{
      this.RemoveChat(chatName);
    }
  }
  protected FindChat(InputText:string){
      this.VisibleChats=this.Chats?.filter(x=>x.name?.includes(InputText))
  }

  protected dateFilter?:Date;
}
