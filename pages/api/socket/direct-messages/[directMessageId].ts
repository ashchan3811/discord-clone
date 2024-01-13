import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";

import { NextApiResponseServerIo } from "@/types/socket-types";

import db from "@/lib/db";
import { getUpdateKey } from "@/lib/utils";

import {
  getConversationByProfileId,
  getCurrentProfileServer,
} from "@/lib/actions";

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

    const { directMessageId, conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is missing" });
    }

    const conversation = await getConversationByProfileId(
      conversationId as string,
      profile.id,
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation.memberOne?.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const { content } = req.body;

    const includeOptions = {
      member: {
        include: {
          profile: true,
        },
      },
    };

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversation.id,
      },
      include: includeOptions,
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ message: "Direct Message not found" });
    }

    const isMessageOwner = directMessage.memberId == member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessage.id,
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

      if (!content) {
        return res.status(400).json({ message: "Content is missing" });
      }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessage.id,
        },
        data: {
          content,
        },
        include: includeOptions,
      });
    }

    const updateKey = getUpdateKey(conversation.id);
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.json(directMessage);
  } catch (error) {
    console.error("DIRECT MESSAGE ID ERROR", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
