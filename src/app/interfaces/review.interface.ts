import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Review {
    id: UUID;
    senderId: UUID;
    userId: UUID;
    text: string;
    createdAt: DateTime;
}