import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from "../chat/chat.component";
import {AuthGuard} from "../shared/auth.guard";
import {ChartsComponent} from "./charts.component";
import {AuthAdminGuard} from "./services/auth-admin.guard";

const routes: Routes = [
  { path: 'admin/chart', component: ChartsComponent, canActivate: [AuthAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsRoutingModule { }
