import {User} from "../../../shared/Dtos/Auth/User";
import {Content} from "./Content";



export class Message{
    id?:string;
    owner?:User;
    chatName?:string
    messageReply?: Message;
    isUpload?:boolean;
    isRead?:boolean;
    isForwarded?:boolean;
    sendTime?:Date;
    textContent?:string;
    createDate?:Date;
    contentFiles?:Content[];
}
