import { DateTime } from "luxon";
import { UUID } from "crypto";


export interface Request {
    id : UUID;
    userId : UUID;
    username: string;
    nickname: string;
    text : string;
    createdAt : DateTime;
}