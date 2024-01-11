import { NextResponse } from "next/server";

import { ChannelIdParams } from "@/types";

import { getCurrentProfile } from "@/lib/actions";
import db from "@/lib/db";

export async function DELETE(req: Request, { params }: ChannelIdParams) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", { status: 404 });
    }

    const server = await db.channel.delete({
      where: {
        id: params.channelId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("CHANNEL ID DELETE", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
