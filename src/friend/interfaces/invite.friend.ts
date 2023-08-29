import { User } from "@prisma/client";

export interface InviteFriend {
  invitations_received: {
    id: string;
    sender: Pick<User, "id" | "email" | "username" | "lastname" | "firstname">;
  }[];
}
