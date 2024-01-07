"use client";

import React, { useEffect } from "react";

import CreateServerModal from "@/components/modals/CreateServerModal";
import InvitePeopleModal from "@/components/modals/InvitePeopleModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InvitePeopleModal />
    </>
  );
};

export default ModalProvider;
