import { NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";

import { getCurrentProfile } from "@/lib/actions";
import db from "@/lib/db";

const MESSAGES_PER_PAGE = 10;

export async function GET(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return new NextResponse("Conversation ID is missing", { status: 400 });
    }

    let messages: DirectMessage[];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PER_PAGE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_PER_PAGE,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_PER_PAGE) {
      nextCursor = messages[MESSAGES_PER_PAGE - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (err) {
    console.log("DIRECT MESSAGES GET", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
