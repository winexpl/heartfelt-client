import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Answer {
    id: UUID;
    questionId: UUID;
    psychologistId: UUID;
    username: string;
    nickname: string;
    text: string;
    createdAt: DateTime;
}