import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MasterChatComponent} from "../layout/master-chat/master-chat.component";
import {AuthGuard} from "../shared/auth.guard";
import {ChatComponent} from "../chat/chat.component";

const routes: Routes = [
  { path: '', component:MasterChatComponent,canActivate: [AuthGuard],children:[
          { path: ':name', component: ChatComponent, canActivate: [AuthGuard] }
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatsRoutingModule { }
