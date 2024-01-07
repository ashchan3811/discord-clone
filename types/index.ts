import { Member, Profile, Server } from "@prisma/client";

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
