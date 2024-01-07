"use client";

import React, { useEffect } from "react";

import CreateServerModal from "@/components/modals/CreateServerModal";
import EditServerModal from "@/components/modals/EditServerModal";
import InvitePeopleModal from "@/components/modals/InvitePeopleModal";
import ManageMembersModal from "@/components/modals/ManageMemebers";

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
      <ManageMembersModal />
    </>
  );
};

export default ModalProvider;
