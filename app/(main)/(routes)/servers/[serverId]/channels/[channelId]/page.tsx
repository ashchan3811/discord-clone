import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/actions";
import db from "@/lib/db";

import {
  CHAT_SOCKET_URLS,
  CHAT_API_URLS,
  ServerIdChannelIdParams,
} from "@/types";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";

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

  const queryParams = {
    serverId: channel.serverId,
    channelId: channel.id,
  };

  return (
    <div className={"bg-white dark:bg-[#313338] flex flex-col h-full"}>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type={"channel"}
      />

      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type={"channel"}
        apiUrl={CHAT_API_URLS.channel}
        socketUrl={CHAT_SOCKET_URLS.channel}
        socketQuery={queryParams}
        paramKey={"channelId"}
        paramValue={channel.id}
      />

      <ChatInput
        name={channel.name}
        type={"channel"}
        apiUrl={CHAT_SOCKET_URLS.channel}
        query={queryParams}
      />
    </div>
  );
};

export default ChannelIdPage;
