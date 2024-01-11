import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ServerIdChannelIdParams } from "@/types";
import { getCurrentProfile } from "@/lib/actions";
import db from "@/lib/db";

import ChatHeader from "@/components/chat/ChatHeader";

const ChannelIdPage = async ({ params }: ServerIdChannelIdParams) => {
  const profile = await getCurrentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
      serverId: params.serverId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
  });

  if (!channel || !member) {
    return redirect(`/`);
  }

  return (
    <div className={"bg-white dark:bg-[#313338] flex flex-col h-full"}>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type={"channel"}
      />
    </div>
  );
};

export default ChannelIdPage;
