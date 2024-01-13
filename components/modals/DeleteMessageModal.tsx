"use client";

import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import qs from "query-string";

import { useModalStore } from "@/hooks/useModalStore";

import DeleteModal from "@/components/shared/DeleteModal";

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const isModalOpen = isOpen && type === "deleteMessage";
  const { message } = data;

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: message?.apiUrl || "",
        query: message?.query,
      });

      await axios.delete(url);

      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeleteModal
      title={"Delete Message"}
      isOpen={isModalOpen}
      isDisabled={isLoading}
      onClose={onClose}
      onConfirm={onDelete}
    >
      Are you sure you want to do this? <br />
      This message will be permanently deleted.
    </DeleteModal>
  );
};

export default DeleteMessageModal;
