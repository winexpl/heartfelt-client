import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Review {
    id: UUID | string;
    senderId: UUID;
    receiverId: UUID | string;
    senderUsername: string;
    receiverUsername: string;
    text: string;
    createdAt: DateTime;
}