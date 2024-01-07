"use client";

import React from "react";
import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

import { ServerWithMembersWithProfiles } from "@/types";

import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModalStore } from "@/hooks/useModalStore";

type ServerHeaderProps = {
  server: ServerWithMembersWithProfiles;
  role?: string;
};
const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModalStore();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={"focus:outline-none"} asChild>
        <button
          type={"button"}
          className={cn(
            "w-full text-md font-semibold px-3 flex items-center h-12",
            "border-neutral-200 dark:border-neutral-800",
            "border-b-2 hover:bg-zinc-700/10",
            "dark:hover:bg-zinc-700/50 transition",
          )}
        >
          {server.name}
          <ChevronDown className={"h-5 w-5 ml-auto"} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          "w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
        }
      >
        {isModerator && (
          <DropdownMenuItem
            className={
              "text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            }
            onClick={() => onOpen("invitePeople", { server })}
          >
            Invite People
            <UserPlus className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            className={"px-3 py-2 text-sm cursor-pointer"}
            onClick={() => onOpen("editServer", { server })}
          >
            Server Settings
            <Settings className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            className={"px-3 py-2 text-sm cursor-pointer"}
            onClick={() => onOpen("manageMembers", { server })}
          >
            Manage Members
            <Users className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            className={"px-3 py-2 text-sm cursor-pointer"}
            onClick={() => onOpen("createChannel", { server })}
          >
            Create Channel
            <PlusCircle className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            className={
              "text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer"
            }
          >
            Delete Server
            <Trash className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            className={
              "text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer"
            }
            onClick={() => onOpen("leaveServer", { server })}
          >
            Leave Server
            <LogOut className={"h-4 w-4 ml-auto"} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
