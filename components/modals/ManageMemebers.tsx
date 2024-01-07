"use client";

import React from "react";
import { MemberRole } from "@prisma/client";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";

import { useModalStore } from "@/hooks/useModalStore";
import { ServerWithMembersWithProfiles } from "@/types";
import { manageMembersRoleIconMap } from "@/types/icon-maps";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/shared/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ManageMembersModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModalStore();
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const isModalOpen = isOpen && type === "manageMembers";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onRoleChange = async (id: string, role: MemberRole) => {
    setLoadingId(id);
    try {
      const url = qs.stringifyUrl({
        url: `/api/members/${id}`,
        query: { serverId: server.id },
      });

      const res = await axios.patch(url, { role });

      router.refresh();

      onOpen("manageMembers", { server: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  const onKick = async (id: string) => {
    setLoadingId(id);
    try {
      const url = qs.stringifyUrl({
        url: `/api/members/${id}`,
        query: { serverId: server.id },
      });

      const res = await axios.delete(url);

      router.refresh();

      onOpen("manageMembers", { server: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"pt-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Manage Members
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className={"mt-8 max-h-[420px] px-6"}>
          {server?.members.map((member) => (
            <div key={member.id} className={"flex items-center gap-x-2 mb-6"}>
              <UserAvatar src={member.profile?.imageUrl} />
              <div className={"flex flex-col space-y-1"}>
                <div
                  className={"text-xs font-semibold flex items-center gap-x-1"}
                >
                  <span>{member.profile?.name}</span>
                  <span>{manageMembersRoleIconMap[member.role]}</span>
                </div>
                <p className={"text-xs text-zinc-500"}>
                  {member?.profile?.email}
                </p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className={"h-4 w-4 text-zinc-500 "} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side={"left"}>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            className={"flex items-center cursor-pointer"}
                          >
                            <ShieldQuestion className={"w-4 h-4 mr-2"} />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                className={"cursor-pointer"}
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.GUEST)
                                }
                              >
                                <Shield className={"w-4 h-4 mr-2"} />
                                <span>Guest</span>
                                {member.role == MemberRole.GUEST && (
                                  <Check className={"h-4 w-4 ml-auto"} />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={"cursor-pointer"}
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.MODERATOR)
                                }
                              >
                                <ShieldCheck className={"w-4 h-4 mr-2"} />
                                <span>Moderator</span>
                                {member.role == MemberRole.MODERATOR && (
                                  <Check className={"h-4 w-4 ml-auto"} />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className={"cursor-pointer"}
                          onClick={() => onKick(member.id)}
                        >
                          <Gavel className={"w-4 h-4 mr-2"} />
                          <span>Kick</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2
                  className={"h-4 w-4 animate-spin text-zinc-500 ml-auto"}
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembersModal;
