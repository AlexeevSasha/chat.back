import { PrismaClient, User, FriendInvitation } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../error/error";
import { InviteFriend } from "./interfaces/invite.friend";

export class FriendService {
  private prisma;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async invite(email: string, userId: string) {
    const [user, targetUser] = await Promise.all<User | null>([
      this.prisma.user.findFirst({ where: { id: userId } }),
      this.prisma.user.findFirst({ where: { email: email } }),
    ]);

    if (!user) throw new NotFoundError("User has not been found.");
    if (!targetUser) throw new NotFoundError(`Friend  of ${email} has not been found. Please check mail address.`);

    if (user.email.toLowerCase() === targetUser.email.toLowerCase()) {
      throw new BadRequestError("Sorry. You cannot become friend with yourself");
    }

    // check if invitation has been already sent
    const invitationAlreadyReceived: FriendInvitation | null = await this.prisma.friendInvitation.findFirst({
      where: {
        OR: [
          {
            senderId: user.id,
            receiverId: targetUser.id,
          },
          {
            senderId: targetUser.id,
            receiverId: user.id,
          },
        ],
      },
    });

    if (invitationAlreadyReceived) throw new BadRequestError("Invitation has been already sentf");

    await this.prisma.friendInvitation.create({
      data: {
        senderId: user.id,
        receiverId: targetUser.id,
      },
    });
  }

  async accept(inviteId: string) {
    const invitation: FriendInvitation | null = await this.prisma.friendInvitation.findFirst({ where: { id: inviteId } });
    if (!invitation) throw new BadRequestError("Error occured. Please try again");

    await this.prisma.user.update({
      where: {
        id: invitation.senderId,
      },
      data: {
        friends: {
          connect: {
            id: invitation.receiverId,
          },
        },
      },
    });

    await this.prisma.friendInvitation.delete({ where: { id: inviteId } });
  }

  async reject(inviteId: string, userId: string) {
    const invitation: FriendInvitation | null = await this.prisma.friendInvitation.findFirst({ where: { id: inviteId } });
    if (!invitation) throw new BadRequestError("Error occured. Please try again");

    await this.prisma.friendInvitation.delete({ where: { id: inviteId } });
  }

  async getAllInvite(userId: string) {
    const inviteUsers = (await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        invitations_received: {
          select: {
            id: true,
            sender: {
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                username: true,
              },
            },
          },
        },
      },
    })) as InviteFriend;

    return inviteUsers?.invitations_received || [];
  }
}
