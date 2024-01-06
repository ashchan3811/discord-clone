import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { getCurrentProfile } from "@/lib/actions/get-current-profile";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuid(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("SERVER POST", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
