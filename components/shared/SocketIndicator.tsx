"use client";
import React from "react";

import { useSocket } from "@/components/providers/SocketProvider";
import { Badge } from "@/components/ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge
        variant={"outline"}
        className={"bg-yellow-600 text-white border-none"}
      >
        Fallback:<span className={"hidden sm:block"}> Polling every 1s</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant={"outline"}
      className={"bg-emerald-600 text-white border-none"}
    >
      Live:<span className={"hidden sm:block"}> Real-time updates</span>
    </Badge>
  );
};

export default SocketIndicator;
