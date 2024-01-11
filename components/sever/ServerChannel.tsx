"use client";

import React from "react";
import { Channel, MemberRole, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Edit, Lock, Trash } from "lucide-react";

import { serverChannelIconMap } from "@/types/icon-maps";
import { cn } from "@/lib/utils";

import ActionTooltip from "@/components/shared/ActionTooltip";
import { ModalType, useModalStore } from "@/hooks/useModalStore";

type ServerChannelProps = {
  channel: Channel;
  server: Server;
  role?: MemberRole;
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();

  const { onOpen } = useModalStore();

  const Icon = serverChannelIconMap[channel.type];

  const handleClick = () => {
    router.push(`/servers/${server?.id}/channels/${channel?.id}`);
  };

  const onAction = (event: React.MouseEvent, modalType: ModalType) => {
    event.stopPropagation();
    onOpen(modalType, { server, channel });
  };

  return (
    <button
      type={"button"}
      onClick={handleClick}
      className={cn(
        "group px-2 py-2 rounded-md flex",
        "items-center gap-x-2 w-full",
        "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        "transition mb-1",
        params?.channelId == channel.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <Icon
        className={"flex-shrink-0 h-5 w-5 text-zinc-500 dark:text-zinc-400"}
      />

      <p
        className={cn(
          "line-clamp-1 font-semibold text-xs",
          "text-zinc-500 dark:text-zinc-400",
          "group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
          "transition",
          params?.channelId == channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {channel.name}
      </p>

      {channel.name != "general" && role !== MemberRole.GUEST && (
        <div className={"ml-auto flex items-center gap-x-2"}>
          <ActionTooltip label={"Edit"}>
            <Edit
              className={cn(
                "hidden group-hover:block h-4 w-4",
                "text-zinc-500 dark:text-zinc-400",
                "hover:text-zinc-600 dark:hover:text-zinc-300",
                "transition",
              )}
              onClick={(event) => onAction(event, "editChannel")}
            />
          </ActionTooltip>
          <ActionTooltip label={"Delete"}>
            <Trash
              className={cn(
                "hidden group-hover:block h-4 w-4",
                "text-rose-500 dark:text-rose-400",
                "hover:text-rose-600 dark:hover:text-rose-300",
                "transition",
              )}
              onClick={(event) => onAction(event, "deleteChannel")}
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name != "general" && role === MemberRole.GUEST && (
        <Lock
          className={cn("ml-auto h-4 w-4", "text-zinc-500 dark:text-zinc-400")}
        />
      )}
    </button>
  );
};

export default ServerChannel;
