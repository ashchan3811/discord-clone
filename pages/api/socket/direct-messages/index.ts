import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/socket-types";

import db from "@/lib/db";
import { getAddKey } from "@/lib/utils";

import {
  getCurrentProfileServer,
  getConversationByProfileId,
} from "@/lib/actions";

const directMessagesHandler = async (
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) => {
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const profile = await getCurrentProfileServer(req);
    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

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

    if (!content) {
      return res.status(400).json({ message: "Content is missing" });
    }

    const member =
      conversation.memberOne?.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversation.id,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = getAddKey(conversation.id);
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("DIRECT MESSAGE POST ERROR: ", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default directMessagesHandler;
