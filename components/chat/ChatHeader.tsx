import React from "react";
import { Hash } from "lucide-react";

import { cn } from "@/lib/utils";

import UserAvatar from "@/components/shared/UserAvatar";
import MobileToggle from "@/components/shared/MobileToggle";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
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

      {type === "conversation" && <UserAvatar src={imageUrl} />}

      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
    </div>
  );
};

export default ChatHeader;
