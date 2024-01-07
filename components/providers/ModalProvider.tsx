"use client";

import React, { useEffect } from "react";

import CreateServerModal from "@/components/modals/CreateServerModal";
import EditServerModal from "@/components/modals/EditServerModal";
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
      <EditServerModal />
      <InvitePeopleModal />
    </>
  );
};

export default ModalProvider;
