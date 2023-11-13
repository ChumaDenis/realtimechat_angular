import {User} from "../../shared/Dtos/Auth/User";
import {Message} from "../messeges/DTOs/Message";

export class ChatElement {

    name?: string;
    lastMessage?:Message;
    unReadMessages?:number;
    privacy?:boolean;
    isChat?:boolean
    createdDate?:Date;
}
