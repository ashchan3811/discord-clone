import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/actions/get-current-profile";
import db from "@/lib/db";

import { PropsWithParams } from "@/types";

type InviteCodePageProps = PropsWithParams<{ inviteCode: string }>;

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await getCurrentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const isValidInviteCode = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
    select: {
      id: true,
    },
  });

  if (!isValidInviteCode) {
    return redirect("/");
  }

  const exitingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (exitingServer) {
    return redirect(`/servers/${exitingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <div>Invite Code Page</div>;
};

export default InviteCodePage;
