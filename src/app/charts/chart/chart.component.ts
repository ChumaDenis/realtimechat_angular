import {Component, Input} from '@angular/core';
import {Chart, ChartConfiguration} from "chart.js";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {

  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: false,
  };
  public chartLabels: string[] = [
      '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
      '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
      '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
      '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
  @Input() chart?:Chart[];
  @Input() chartDatasets: ChartConfiguration<'line'>['data']['datasets'] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
    { data: [60, 59, 20, 11, 96, 55, 90], label: 'Series B' }
  ];

  constructor() {
  }
}
