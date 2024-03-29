import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { getCurrentProfile } from "@/lib/actions/get-current-profile";
import db from "@/lib/db";

import { ServerIdParams } from "@/types";

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
        profileId: profile.id,
      },
      data: {
        inviteCode: uuid(),
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("SERVER ID INVITE CODE PATCH", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
