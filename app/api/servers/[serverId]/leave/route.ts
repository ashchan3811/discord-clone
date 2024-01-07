import { NextResponse } from "next/server";

import { ServerIdParams } from "@/types";

import db from "@/lib/db";
import { getCurrentProfile } from "@/lib/actions";

export async function PATCH(req: Request, { params }: ServerIdParams) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 404 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("SERVER ID LEAVE PATCH", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
