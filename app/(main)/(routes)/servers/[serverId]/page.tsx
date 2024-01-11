"use server";

import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ServerIdParams } from "@/types";
import { getCurrentProfile } from "@/lib/actions";
import db from "@/lib/db";

const ServerIdPage = async ({ params }: ServerIdParams) => {
  const profile = await getCurrentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server || !server.channels) {
    return null;
  }

  const [initialChannel] = server?.channels;

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
};

export default ServerIdPage;
