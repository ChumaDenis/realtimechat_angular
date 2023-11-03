import {User} from "../../components/Models/user";
import {Message} from "../../shared/Dtos/Message";

export class ChatElement {

    name?: string;
    lastMessage?:Message;
    createdDate?:Date;
}
