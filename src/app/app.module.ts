import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./shared/authconfig.interceptor";
import { MasterChatComponent } from './layout/master-chat/master-chat.component';
import {AuthModule} from "./auth/auth.module";
import {ChatModule} from "./chat/chat.module";
import {ChatMenuModule} from "./chat-menu/chat-menu.module";

const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: 'chats', loadChildren: () => import('./chat-menu/chat-menu.module').then(m => m.ChatMenuModule) }
];

@NgModule({
    declarations: [
        AppComponent,
        MasterChatComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        AuthModule,
        ChatModule,
        ChatMenuModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
    ],
    exports: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
