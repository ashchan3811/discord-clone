"use client";

import React from "react";
import { Member, Profile, Server } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { manageMembersRoleIconMap } from "@/types/icon-maps";
import { cn } from "@/lib/utils";

import UserAvatar from "@/components/shared/UserAvatar";

type ServerMemberProps = {
  member: Member & { profile: Profile };
  server: Server;
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = manageMembersRoleIconMap[member.role];

  const handleClick = () => {
    router.push(`/servers/${server?.id}/members/${member?.id}`);
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
        params?.memberId == member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
    >
      <UserAvatar
        src={member.profile?.imageUrl}
        className={"h-6 w-6 md:h-8 md:w-8"}
      />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm",
          "text-zinc-500 dark:text-zinc-400",
          "group-hover:text-zinc-600 dark:group-hover:text-zinc-300",
          "transition",
          params?.memberId == member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {member.profile?.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
