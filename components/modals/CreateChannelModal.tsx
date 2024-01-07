"use client";

import React from "react";

import { useModalStore } from "@/hooks/useModalStore";

import ChannelForm from "@/components/shared/ChannelForm";

const CreateServerModal = () => {
  const { isOpen, type, onClose } = useModalStore();
  const isModalOpen = isOpen && type === "createChannel";

  return (
    <ChannelForm
      isOpen={isModalOpen}
      onClose={onClose}
      onFormSubmit={onClose}
    />
  );
};

export default CreateServerModal;
