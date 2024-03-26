import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {ContextMenuComponent} from "./components/context-menu/context-menu.component";



@NgModule({
  declarations: [
    ContextMenuComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  exports:[
    ContextMenuComponent
  ]
})
export class SharedModule { }
