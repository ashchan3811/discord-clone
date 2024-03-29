import { Member, Message, Profile, Server } from "@prisma/client";
import React from "react";

export type InputPropTypes<T> = {
  value: T;
  onChange: (value: T) => void;
};

export type ServerWithMembersWithProfiles = Server & {
  members: MemberWithProfile[];
};

export type MessageWithMemberWithProfile = Message & {
  member: MemberWithProfile;
};

export type MemberWithProfile = Member & {
  profile: Profile;
};

export type PropsWithParams<T> = {
  params: T;
};

export type PropsWithSearchParams<T> = {
  searchParams: T;
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

export type VideoSearchParams = PropsWithSearchParams<{ video?: boolean }>;

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
  conversation: "/api/direct-messages",
  channel: "/api/messages",
};

export const CHAT_SOCKET_URLS = {
  conversation: "/api/socket/direct-messages",
  channel: "/api/socket/messages",
};

export type MessageEndpoint = {
  apiUrl: string;
  query: Record<string, any>;
};

export type IChatQueryData = {
  pages: { items: MessageWithMemberWithProfile[] }[];
};
