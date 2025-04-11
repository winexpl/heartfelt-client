import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Claim {
    [x: string]: any;
    id: UUID;
    senderId: UUID;
    receiverId: UUID;
    text: string;
    createdAt: DateTime;
    answerId: UUID;
    questionId: UUID;
    claimType: ClaimType;
    senderUsername: string;
    receiverUsername: string;
}

export enum ClaimType {
    ANSWER="ANSWER",
    QUESTION="QUESTION"
}