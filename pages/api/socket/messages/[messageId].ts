import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types/socket-types";

import { getCurrentProfileServer } from "@/lib/actions";

import db from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { getUpdateKey } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method != "PATCH" && req.method != "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const profile = await getCurrentProfileServer(req);
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { messageId, serverId, channelId } = req.query;

    if (!serverId) {
      return res.status(400).json({ message: "Server ID is missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is missing" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const { content } = req.body;

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const includeOptions = {
      member: {
        include: {
          profile: true,
        },
      },
    };

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channel.id,
      },
      include: includeOptions,
    });

    if (!message || message.deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    const isMessageOwner = message.memberId == member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: message.id,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: includeOptions,
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      message = await db.message.update({
        where: {
          id: message.id,
        },
        data: {
          content,
        },
        include: includeOptions,
      });
    }

    const updateKey = getUpdateKey(channel.id);
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.json(message);
  } catch (error) {
    console.error("MESSAGE ID ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
