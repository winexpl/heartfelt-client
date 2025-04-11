import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Answer {
    id: UUID | string;
    questionId: UUID;
    psychologistId: UUID;
    username: string;
    nickname: string;
    text: string;
    createdAt: DateTime;
}