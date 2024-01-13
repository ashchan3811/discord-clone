"use client";

import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import ActionTooltip from "@/components/shared/ActionTooltip";
import { useParams, useRouter } from "next/navigation";

type NavigationItemProps = {
  id: string;
  imageUrl: string;
  name: string;
};

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip label={name} side={"right"} align={"center"}>
      <button
        type={"button"}
        onClick={handleClick}
        className={"group relative flex items-center"}
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]",
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-48 w-48 rounded-24 group-hover:rounded-16 transition-all overflow-hidden",
            params?.serverId === id && "bg-primary/10 text-primary rounded-16",
          )}
        >
          <Image fill src={imageUrl} alt={"channel"} />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
