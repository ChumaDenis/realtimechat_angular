import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsRoutingModule } from './charts-routing.module';
import {ChartsComponent} from "./charts.component";
import {SharedModule} from "../shared/shared.module";
import {MatIconModule} from "@angular/material/icon";
import {NgChartsModule} from "ng2-charts";
import { ChartComponent } from './chart/chart.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ChartsComponent,
    ChartComponent
  ],
    imports: [
        CommonModule,
        ChartsRoutingModule,
        SharedModule,
        MatIconModule,
        NgChartsModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class ChartModule { }
