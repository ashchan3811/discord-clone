"use client";
import React, { PropsWithChildren } from "react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

type ActionTooltipProps = PropsWithChildren<{
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}>;

const ActionTooltip = ({
  label,
  align,
  side,
  children,
}: ActionTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild={true}>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className={"font-semibold text-sm capitalize"}>
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
