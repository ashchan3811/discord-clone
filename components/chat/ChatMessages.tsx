import React from "react";
import { Member } from "@prisma/client";

import { ChatParamTypes, ChatTypes } from "@/types";

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
  return (
    <div className={"flex-1 flex flex-col py-4 overflow-y-auto"}>
      <div className={"flex-1"} />
      <ChatWelcome type={type} name={name} />
    </div>
  );
};

export default ChatMessages;
