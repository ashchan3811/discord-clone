"use client";

import React from "react";

import { useModalStore } from "@/hooks/useModalStore";

import ChannelForm from "@/components/shared/ChannelForm";
import { ChannelType } from "@prisma/client";

const CreateServerModal = () => {
  const { isOpen, type, onClose, data } = useModalStore();
  const isModalOpen = isOpen && type === "createChannel";

  const { channelType } = data;

  return (
    <ChannelForm
      isOpen={isModalOpen}
      onClose={onClose}
      onFormSubmit={onClose}
      channelType={channelType}
    />
  );
};

export default CreateServerModal;
