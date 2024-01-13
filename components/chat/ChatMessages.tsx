"use client";

import React, { Fragment } from "react";
import { Member } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";

import { formatDate, getAddKey, getQueryKey, getUpdateKey } from "@/lib/utils";

import {
  ChatParamTypes,
  ChatTypes,
  MessageWithMemberWithProfile,
} from "@/types";

import { useChatQuery } from "@/hooks/useChatQuery";
import { useChatSocket } from "@/hooks/useChatSocket";

import ChatWelcome from "@/components/chat/ChatWelcome";
import ChatItem from "@/components/chat/ChatItem";

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
  const queryKey = getQueryKey(chatId);
  const addKey = getAddKey(chatId);
  const updateKey = getUpdateKey(chatId);

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramValue,
      paramKey,
    });

  useChatSocket({ addKey, updateKey, queryKey });

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
            {page.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                timestamp={formatDate(message.createdAt)}
                currentMember={member}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
                isUpdated={message.updatedAt !== message.createdAt}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
