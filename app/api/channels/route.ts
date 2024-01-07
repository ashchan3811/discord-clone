import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { getCurrentProfile } from "@/lib/actions/get-current-profile";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !type) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    if (name.toLowerCase() === "general") {
      return new NextResponse("Name cannot be general", { status: 400 });
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
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("CHANNEL POST", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
