import React from "react";

import { useModalStore } from "@/hooks/useModalStore";

import ServerForm from "@/components/shared/ServerForm";

const EditServerModal = () => {
  const { isOpen, type, onClose, data } = useModalStore();
  const isModalOpen = isOpen && type === "editServer";

  const { server } = data;

  return (
    <ServerForm
      isOpen={isModalOpen}
      onClose={onClose}
      onFormSubmit={onClose}
      server={server}
    />
  );
};

export default EditServerModal;
