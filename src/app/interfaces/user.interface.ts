import { UUID } from "crypto";
import { DateTime } from 'luxon';

export interface User {
  id: UUID | string;
  username: string;
  nickname: string;
  about: string;
  role: Role[];
  createdAt: DateTime; 
}

export enum Role {
  ADMIN="ADMIN", 
  SUFFERY="SUFFERY",
  PSYCHOLOG="PSYCHOLOG"
}