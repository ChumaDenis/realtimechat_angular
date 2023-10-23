import {User} from "../../components/Models/user";

export class Chat {

    name?: string;
    chatOwner?:User;
    chatUsers?:User[];
    createDate?:Date;

}
