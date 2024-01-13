import React from "react";
import { Hash } from "lucide-react";

import { cn } from "@/lib/utils";
import { ChatTypes } from "@/types";

import UserAvatar from "@/components/shared/UserAvatar";
import MobileToggle from "@/components/shared/MobileToggle";
import SocketIndicator from "@/components/shared/SocketIndicator";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: ChatTypes;
  imageUrl?: string;
};

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div
      className={cn(
        "tex-md font-semibold px-3 flex items-center",
        "h-12 border-neutral-200 dark:border-neutral-800 border-b-2",
      )}
    >
      <MobileToggle serverId={serverId} />

      {type === "channel" && (
        <Hash className={"h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2"} />
      )}

      {type === "conversation" && (
        <UserAvatar src={imageUrl} className={"h-6 w-6 md:h-8 md:w-8 mr-2"} />
      )}

      <p className="font-semibold text-md text-black dark:text-white">{name}</p>

      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
