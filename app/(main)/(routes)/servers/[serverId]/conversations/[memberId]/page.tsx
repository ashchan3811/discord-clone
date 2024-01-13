import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import {
  CHAT_API_URLS,
  CHAT_SOCKET_URLS,
  ServerIdMemberIdParams,
} from "@/types";
import { getCurrentProfile, getOrCreateConversation } from "@/lib/actions";
import db from "@/lib/db";

import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

const MemberIdPage = async ({ params }: ServerIdMemberIdParams) => {
  const profile = await getCurrentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect(`/`);
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId,
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

  return (
    <div className={"bg-white dark:bg-[#313338] flex flex-col h-full"}>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type={"conversation"}
      />

      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversation?.id}
        apiUrl={CHAT_API_URLS.conversation}
        socketUrl={CHAT_SOCKET_URLS.conversation}
        socketQuery={{
          conversationId: conversation?.id,
        }}
        paramKey={"conversationId"}
        paramValue={conversation.id}
        type={"conversation"}
      />

      <ChatInput
        name={otherMember.profile.name}
        type={"conversation"}
        apiUrl={CHAT_SOCKET_URLS.conversation}
        query={{
          conversationId: conversation?.id,
        }}
      />
    </div>
  );
};

export default MemberIdPage;
