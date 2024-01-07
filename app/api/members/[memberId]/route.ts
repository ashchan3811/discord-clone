import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { getCurrentProfile } from "@/lib/actions/get-current-profile";
import db from "@/lib/db";

import { MemberIdParams } from "@/types";

export async function PATCH(req: Request, { params }: MemberIdParams) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 404 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 404 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
              role: {
                not: MemberRole.ADMIN,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("MEMBER ID PATCH", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: MemberIdParams) {
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

    if (!params.memberId) {
      return new NextResponse("Member ID Missing", { status: 404 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
            role: {
              not: MemberRole.ADMIN,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("MEMBER ID DELETE", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
