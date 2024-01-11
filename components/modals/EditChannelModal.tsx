"use client";

import React from "react";

import { useModalStore } from "@/hooks/useModalStore";

import ChannelForm from "@/components/shared/ChannelForm";

const CreateServerModal = () => {
  const { isOpen, type, onClose, data } = useModalStore();
  const isModalOpen = isOpen && type === "editChannel";

  const { channel, server } = data;

  return (
    <ChannelForm
      isOpen={isModalOpen}
      onClose={onClose}
      onFormSubmit={onClose}
      server={server}
      channel={channel}
    />
  );
};

export default CreateServerModal;
