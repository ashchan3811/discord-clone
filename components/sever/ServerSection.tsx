"use client";

import React from "react";
import { ChannelType, MemberRole } from "@prisma/client";
import { Plus, Settings } from "lucide-react";

import { ISearchItemTypes, ServerWithMembersWithProfiles } from "@/types";
import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/shared/ActionTooltip";
import { useModalStore } from "@/hooks/useModalStore";

type ServerSectionProps = {
  label: string;
  role?: MemberRole;
  sectionType: ISearchItemTypes;
  channelType: ChannelType;
  server?: ServerWithMembersWithProfiles;
};

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModalStore();

  return (
    <div className={"flex items-center justify-between py-2"}>
      <p
        className={cn(
          "text-xs uppercase font-semibold",
          "text-zinc-500 dark:text-zinc-400",
        )}
      >
        {label}
      </p>

      {role != MemberRole.GUEST && sectionType == "channel" && (
        <ActionTooltip label={"Create Channel"} side={"top"}>
          <button
            className={cn(
              "text-zinc-500 hover:text-zinc-600",
              "dark:text-zinc-400 dark:hover:text-zinc-300",
              "transition",
            )}
            onClick={() => {
              onOpen("createChannel", { server, channelType });
            }}
          >
            <Plus className={"h-4 w-4"} />
          </button>
        </ActionTooltip>
      )}

      {role == MemberRole.ADMIN && sectionType == "member" && (
        <ActionTooltip label={"Invite Member"} side={"top"}>
          <button
            className={cn(
              "text-zinc-500 hover:text-zinc-600",
              "dark:text-zinc-400 dark:hover:text-zinc-300",
              "transition",
            )}
            onClick={() => {
              onOpen("manageMembers", { server });
            }}
          >
            <Settings className={"h-4 w-4"} />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
