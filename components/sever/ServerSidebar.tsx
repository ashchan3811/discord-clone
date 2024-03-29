import React from "react";
import { redirect } from "next/navigation";
import { ChannelType } from "@prisma/client";

import { getCurrentProfile, getServerWithMembers } from "@/lib/actions";

import { channelIconMap, serverSearchRoleIconMap } from "@/types/icon-maps";
import { ISearchItem } from "@/types";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import ServerHeader from "@/components/sever/ServerHeader";
import ServerSearch from "@/components/sever/ServerSearch";
import ServerSection from "@/components/sever/ServerSection";
import ServerChannel from "@/components/sever/ServerChannel";
import ServerMember from "@/components/sever/ServerMember";

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

  const serverSearchData: ISearchItem[] = [
    {
      label: "Text Channels",
      type: "channel",
      data: textChannels?.map((channel) => ({
        icon: channelIconMap[channel.type],
        name: channel.name,
        id: channel.id,
      })),
    },
    {
      label: "Voice Channels",
      type: "channel",
      data: audioChannels?.map((channel) => ({
        icon: channelIconMap[channel.type],
        name: channel.name,
        id: channel.id,
      })),
    },
    {
      label: "Video Channels",
      type: "channel",
      data: videoChannels?.map((channel) => ({
        icon: channelIconMap[channel.type],
        name: channel.name,
        id: channel.id,
      })),
    },
    {
      label: "Members",
      type: "member",
      data: members?.map((member) => ({
        icon: serverSearchRoleIconMap[member.role],
        name: member.profile?.name,
        id: member.id,
      })),
    },
  ];

  return (
    <div
      className={
        "flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]"
      }
    >
      <ServerHeader server={server} role={role} />

      <ScrollArea className={"flex-1 px-3"}>
        <div className="mt-2">
          <ServerSearch data={serverSearchData} />
        </div>

        <Separator className={"bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"} />

        {!!textChannels.length && (
          <div className={"mb-2"}>
            <ServerSection
              label={"Text Channels"}
              sectionType={"channel"}
              channelType={ChannelType.TEXT}
              role={role}
              server={server}
            />

            <div className={"space-y-[2px]"}>
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels.length && (
          <div className={"mb-2"}>
            <ServerSection
              label={"Voice Channels"}
              sectionType={"channel"}
              channelType={ChannelType.AUDIO}
              role={role}
              server={server}
            />

            <div className={"space-y-[2px]"}>
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels.length && (
          <div className={"mb-2"}>
            <ServerSection
              label={"Video Channels"}
              sectionType={"channel"}
              channelType={ChannelType.VIDEO}
              role={role}
              server={server}
            />

            <div className={"space-y-[2px]"}>
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!members.length && (
          <div className={"mb-2"}>
            <ServerSection
              label={"Members"}
              sectionType={"member"}
              role={role}
              server={server}
            />

            <div className={"space-y-[2px]"}>
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
