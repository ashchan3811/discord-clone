"use client";

import React, { useEffect } from "react";
import ServerForm from "@/components/shared/ServerForm";

const InitialServerModal = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ServerForm
      isOpen={true}
      onClose={() => {}}
      onServerCreate={() => {
        window.location.reload();
      }}
    />
  );
};

export default InitialServerModal;
