import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessageComponent} from "./message.component";
import {VideoComponent} from "./components/video/video.component";
import {SelectedFilesComponent} from "../components/selected-files/selected-files.component";
import {ContentViewComponent} from "./components/content-view/content-view.component";
import {ContentElementComponent} from "./components/content-element/content-element.component";
import {MatIconModule} from "@angular/material/icon";
import {AuthModule} from "../../auth/auth.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {SharedModule} from "../../shared/shared.module";
import {SelectChatsComponent} from "../components/select-chats/select-chats.component";



@NgModule({
  declarations: [
    MessageComponent,
    VideoComponent,
    ContentViewComponent,
    ContentElementComponent,
     SelectChatsComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    AuthModule,
    FormsModule,
    VgCoreModule,
    VgControlsModule,
    VgBufferingModule,
    VgOverlayPlayModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports:[
    MessageComponent
  ]
})
export class MessagesModule { }
