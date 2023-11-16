import {User} from "../../shared/Dtos/Auth/User";
import {Message} from "../messeges/DTOs/Message";
import {UnreadMessages} from "./UnreadMessages";

export class ChatElement {

    name?: string;
    lastMessage?:Message;
    privacy?:boolean;
    isChat?:boolean
    createdDate?:Date;
    unreadMessages?:UnreadMessages;
}
