"use client";

import React, { Fragment } from "react";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import {
  ChatParamTypes,
  ChatTypes,
  MessageWithMembersWithProfiles,
} from "@/types";

import { useChatQuery } from "@/hooks/useChatQuery";

import ChatWelcome from "@/components/chat/ChatWelcome";

type ChatMessagesProps = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: ChatParamTypes;
  paramValue: string;
  type: ChatTypes;
};

const ChatMessages = ({
  name,
  chatId,
  socketQuery,
  socketUrl,
  apiUrl,
  paramValue,
  paramKey,
  type,
  member,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramValue,
      paramKey,
    });

  if (status === "pending") {
    return (
      <div className={"flex-1 flex flex-col justify-center items-center"}>
        <Loader2 className={"h-7 w-7 text-zinc-500 animate-spin my-4"} />
        <p className={"text-xs text-zinc-500 dark:text-zinc-400"}>
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={"flex-1 flex flex-col justify-center items-center"}>
        <ServerCrash className={"h-7 w-7 text-zinc-500 my-4"} />
        <p className={"text-xs text-zinc-500 dark:text-zinc-400"}>
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className={"flex-1 flex flex-col py-4 overflow-y-auto"}>
      <div className={"flex-1"} />
      <ChatWelcome type={type} name={name} />

      <div className={"flex flex-col-reverse mt-auto"}>
        {data?.pages?.map((page, i) => (
          <Fragment key={i}>
            {page.items.map((message: MessageWithMembersWithProfiles) => (
              <div key={message.id}>{message.content}</div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
