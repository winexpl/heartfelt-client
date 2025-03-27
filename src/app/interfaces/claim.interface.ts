import { UUID } from "crypto";
import { DateTime } from "luxon";

export interface Claim {
    id: UUID;
    senderId: UUID;
    userId: UUID;
    text: string;
    createdAt: DateTime;
    refId: UUID;
    claimType: ClaimType;
    senderUsername: string;
    receiverUsername: string;
}

export enum ClaimType {
    ANSWER="ANSWER",
    QUESTION="QUESTION"
}