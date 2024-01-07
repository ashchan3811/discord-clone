"use client";

import React, { useEffect } from "react";

import CreateServerModal from "@/components/modals/CreateServerModal";
import EditServerModal from "@/components/modals/EditServerModal";
import InvitePeopleModal from "@/components/modals/InvitePeopleModal";
import ManageMembersModal from "@/components/modals/ManageMemebers";
import CreateChannelModal from "@/components/modals/CreateChannelModal";
import LeaveServerModal from "@/components/modals/LeaveServerModal";
import DeleteServerModal from "@/components/modals/DeleteServerModal";

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
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
    </>
  );
};

export default ModalProvider;
