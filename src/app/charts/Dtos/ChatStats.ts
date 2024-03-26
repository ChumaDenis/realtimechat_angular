import {User} from "../../shared/Dtos/Auth/User";

export class ChatStats {

    id?: string
    description?: string
    name?: string
    chatOwner?:User
    userViewModels?:User[]
    createDate?:Date
    privacy?:boolean
    isChat?:boolean

    totalMessages?:number
    totalUsers?:number

}
