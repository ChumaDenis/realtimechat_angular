import {User} from "../../components/Models/user";


export class Message{
    id?:string;
    owner?:User;
    messageReply?: Message;
    isUpload?:boolean;
    isRead?:boolean;
    isForwarded?:boolean;
    sendTime?:Date;
    textContent?:string;
    createDate?:Date;
}
