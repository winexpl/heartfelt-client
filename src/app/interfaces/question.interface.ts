import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Question {
    id: UUID | string;
    userId: UUID | string;
    username: string;
    nickname: string;
    title: string;
    text: string;
    createdAt: DateTime;
    anonymous: boolean;
}