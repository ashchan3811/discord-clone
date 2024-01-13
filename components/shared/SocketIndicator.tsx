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
        <span className={"hidden sm:block"}>Fallback: Polling every 1s</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant={"outline"}
      className={"bg-emerald-600 text-white border-none"}
    >
      <span className={"hidden sm:block"}>Live: Real-time updates</span>
    </Badge>
  );
};

export default SocketIndicator;
