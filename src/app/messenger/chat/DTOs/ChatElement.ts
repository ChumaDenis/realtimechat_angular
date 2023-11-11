import {User} from "../../../shared/Dtos/User";
import {Message} from "../../../shared/Dtos/Message";

export class ChatElement {

    name?: string;
    lastMessage?:Message;
    createdDate?:Date;
}
