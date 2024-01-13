import { Member, Profile, Server } from "@prisma/client";
import React from "react";

export type InputPropTypes<T> = {
  value: T;
  onChange: (value: T) => void;
};

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[];
};

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type PropsWithParams<T> = {
  params: T;
};

export type ServerIdParams = PropsWithParams<{
  serverId: string;
}>;

export type ChannelIdParams = PropsWithParams<{
  channelId: string;
}>;

export type MemberIdParams = PropsWithParams<{
  memberId: string;
}>;

export type ISearchItemTypes = "channel" | "member";

export type ISearchItem = {
  label: string;
  type: ISearchItemTypes;
  data:
    | {
        icon: React.ReactNode;
        name: string;
        id: string;
      }[]
    | undefined;
};

export type ServerIdChannelIdParams = ServerIdParams & ChannelIdParams;
export type ServerIdMemberIdParams = ServerIdParams & MemberIdParams;

export type ChatTypes = "conversation" | "channel";
export type ChatParamTypes = "conversationId" | "channelId";

export const CHAT_API_URLS = {
  conversation: "/api/messages",
  channel: "/api/messages",
};

export const CHAT_SOCKET_URLS = {
  conversation: "/api/socket/messages",
  channel: "/api/socket/messages",
};

export type MessageEndpoint = {
  apiUrl: string;
  query: Record<string, any>;
};
