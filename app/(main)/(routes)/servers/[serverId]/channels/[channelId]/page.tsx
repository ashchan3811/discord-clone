import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/actions";
import db from "@/lib/db";

import { CHAT_API_URLS, ServerIdChannelIdParams } from "@/types";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";

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

      <div className="flex-1">Messages</div>

      <ChatInput
        name={channel.name}
        type={"channel"}
        apiUrl={CHAT_API_URLS.channel}
        query={{ serverId: channel.serverId, channelId: channel.id }}
      />
    </div>
  );
};

export default ChannelIdPage;
