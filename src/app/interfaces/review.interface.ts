import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Review {
    id: UUID;
    senderId: UUID;
    receiverId: UUID;
    senderUsername: string;
    receiverUsername: string;
    text: string;
    createdAt: DateTime;
}