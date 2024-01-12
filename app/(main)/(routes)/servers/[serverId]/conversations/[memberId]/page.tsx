import React from "react";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { ServerIdMemberIdParams } from "@/types";
import { getCurrentProfile, getOrCreateConversation } from "@/lib/actions";
import db from "@/lib/db";

import ChatHeader from "@/components/chat/ChatHeader";

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
    </div>
  );
};

export default MemberIdPage;
