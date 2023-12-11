import {User} from "../../shared/Dtos/Auth/User";

export class Chat {

    name?: string;
    chatOwner?:User;
    userViewModels?:User[];
    description?:string;
    privacy?:boolean;
    isChat?:boolean;
    isOwner?:boolean;
    isSubscribe?:boolean;
    createDate?:Date;

}
