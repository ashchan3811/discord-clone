"use client";

import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useModalStore } from "@/hooks/useModalStore";

import DeleteModal from "@/components/shared/DeleteModal";

const DeleteServerModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModalStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);

      onClose();

      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeleteModal
      title={"Delete Channel"}
      isOpen={isModalOpen}
      isDisabled={isLoading}
      onClose={onClose}
      onConfirm={onDelete}
    >
      Are you sure you want to do this? <br />
      <span className={"font-semibold text-indigo-500"}>
        {server?.name}
      </span>{" "}
      will be permanently deleted.
    </DeleteModal>
  );
};

export default DeleteServerModal;
