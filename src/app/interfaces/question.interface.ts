import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Question {
    id: UUID;
    userId: UUID;
    username: string;
    nickname: string;
    title: string;
    text: string;
    createdAt: DateTime;
    anonymous: boolean;
}