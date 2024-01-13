"use client";

import React from "react";

import { useModalStore } from "@/hooks/useModalStore";

import MessageFileUploadForm from "@/components/shared/MessageFileUploadForm";

const MessageFileUploadModal = () => {
  const { isOpen, type, onClose, data } = useModalStore();
  const isModalOpen = isOpen && type === "messageUploadFile";

  const { message } = data;

  return (
    <MessageFileUploadForm
      isOpen={isModalOpen}
      onClose={onClose}
      message={message}
    />
  );
};

export default MessageFileUploadModal;
