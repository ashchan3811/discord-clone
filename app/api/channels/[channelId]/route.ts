import { NextResponse } from "next/server";

import { ChannelIdParams } from "@/types";

import { getCurrentProfile } from "@/lib/actions";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(req: Request, { params }: ChannelIdParams) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 404 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", { status: 404 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("CHANNEL ID DELETE", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
