"use client";

import React from "react";

import { useModalStore } from "@/hooks/useModalStore";

import ChannelForm from "@/components/shared/ChannelForm";

const CreateServerModal = () => {
  const { isOpen, type, onClose, data } = useModalStore();
  const isModalOpen = isOpen && type === "createChannel";

  const { channelType, server } = data;

  return (
    <ChannelForm
      isOpen={isModalOpen}
      onClose={onClose}
      onFormSubmit={onClose}
      server={server}
      channelType={channelType}
    />
  );
};

export default CreateServerModal;
