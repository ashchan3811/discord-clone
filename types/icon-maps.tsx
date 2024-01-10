import React from "react";

import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { cn } from "@/lib/utils";

export const roleIconMap = (direction: "left" | "right") => {
  return {
    [MemberRole.GUEST]: null,
    [MemberRole.MEMBER]: null,
    [MemberRole.MODERATOR]: (
      <ShieldCheck
        className={cn(
          "h-4 w-4 ml-2 text-indigo-500",
          direction == "right" && "ml-2",
          direction == "left" && "mr-2",
        )}
      />
    ),
    [MemberRole.ADMIN]: (
      <ShieldAlert
        className={cn(
          "h-4 w-4 ml-2 text-rose-500",
          direction == "right" && "ml-2",
          direction == "left" && "mr-2",
        )}
      />
    ),
  };
};

export const serverSearchRoleIconMap = roleIconMap("left");

export const manageMembersRoleIconMap = roleIconMap("right");

export const channelIconMap = {
  [ChannelType.TEXT]: <Hash className={"h-4 w-4 mr-2"} />,
  [ChannelType.AUDIO]: <Mic className={"h-4 w-4 mr-2"} />,
  [ChannelType.VIDEO]: <Video className={"h-4 w-4 mr-2"} />,
};

export const serverChannelIconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
