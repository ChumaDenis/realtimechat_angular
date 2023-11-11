import {User} from "../../../shared/Dtos/User";

export class Chat {

    name?: string;
    chatOwner?:User;
    userViewModels?:User[];
    createDate?:Date;

}
