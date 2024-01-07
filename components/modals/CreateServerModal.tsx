import React from "react";

import { useModalStore } from "@/hooks/useModalStore";

import ServerForm from "@/components/shared/ServerForm";

const CreateServerModal = () => {
  const { isOpen, type, onClose } = useModalStore();
  const isModalOpen = isOpen && type === "createServer";

  return (
    <ServerForm isOpen={isModalOpen} onClose={onClose} onFormSubmit={onClose} />
  );
};

export default CreateServerModal;
