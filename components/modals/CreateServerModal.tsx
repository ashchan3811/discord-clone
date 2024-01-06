import React from "react";

import { useModalStore } from "@/hooks/useModalStore";
import ServerForm from "@/components/shared/ServerForm";

const CreateServerModal = () => {
  const { isOpen, onClose } = useModalStore();

  return (
    <ServerForm isOpen={isOpen} onClose={onClose} onServerCreate={onClose} />
  );
};

export default CreateServerModal;
