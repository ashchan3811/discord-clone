import React from "react";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { getCurrentProfile, getServerWithMembers } from "@/lib/actions";

import ServerHeader from "@/components/sever/ServerHeader";

type ServerSidebarProps = {
  serverId: string;
};

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await getCurrentProfile();
  if (!profile) {
    return redirect("/");
  }

  const server = await getServerWithMembers(profile, serverId);

  if (!server) {
    return redirect("/");
  }

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );

  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );

  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const members = server?.members?.filter(
    (member) => member.profileId !== profile.id,
  );

  const role = server.members?.find((member) => member.profileId === profile.id)
    ?.role;

  return (
    <div
      className={
        "flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]"
      }
    >
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
