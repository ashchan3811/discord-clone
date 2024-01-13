import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types/socket-types";
import { getCurrentProfileServer } from "@/lib/actions";
import db from "@/lib/db";

const messagesHandler = async (
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
    const { serverId, channelId } = req.query;

    if (!serverId) {
      return res.status(400).json({ message: "Server ID is missing" });
    }

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is missing" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is missing" });
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

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id,
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
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

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.error("MESSAGE POST ERROR: ", error);
    return res.status(500).json({ message: "Internal error" });
  }
};

export default messagesHandler;
