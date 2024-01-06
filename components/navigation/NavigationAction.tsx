"use client";

import React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/shared/ActionTooltip";
import { useModalStore } from "@/hooks/useModalStore";

const NavigationAction = () => {
  const { onOpen } = useModalStore();

  return (
    <div>
      <ActionTooltip label={"Add a server"} side={"right"} align={"center"}>
        <button
          type={"button"}
          className={cn("group flex items-center")}
          onClick={() => onOpen("createServer")}
        >
          <div
            className={cn(
              "flex mx-3 h-48 w-48 rounded-24 group-hover:rounded-16",
              "transition-all overflow-hidden items-center",
              "justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500",
            )}
          >
            <Plus
              className={"group-hover:text-white transition text-emerald-500"}
              size={24}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
