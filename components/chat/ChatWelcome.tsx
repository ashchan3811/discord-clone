"use client";

import React from "react";
import { Hash } from "lucide-react";

import { ChatTypes } from "@/types";

import { cn } from "@/lib/utils";

type ChatWelcomeProps = {
  type: ChatTypes;
  name: string;
};

const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  const descriptionMap = {
    channel: `This is the start of the #${name} channel.`,
    conversation: `This is the start of your conversation with ${name}.`,
  };

  const welcomeMessageMap = {
    channel: `Welcome to #${name}!`,
    conversation: `${name}`,
  };

  return (
    <div className={"space-y-2 px-4 mb-4"}>
      {type == "channel" && (
        <div
          className={cn(
            "h-[48px] w-[48px] md:h-[72px] md:w-[72px]",
            "rounded-full",
            "bg-zinc-500 dark:bg-zinc-700",
            "flex items-center justify-center",
          )}
        >
          <Hash className={"h-8 w-8 md:h-12 md:w-12 text-white"} />
        </div>
      )}

      <p className={"text-xl md:text-3xl font-bold"}>
        {welcomeMessageMap[type]}
      </p>

      <p className={"text-zinc-600 dark:text-zinc-400 text-sm"}>
        {descriptionMap[type]}
      </p>
    </div>
  );
};

export default ChatWelcome;
