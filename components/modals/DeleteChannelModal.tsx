"use client";

import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

import { useModalStore } from "@/hooks/useModalStore";

import DeleteModal from "@/components/shared/DeleteModal";

const DeleteChannelModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModalStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const isModalOpen = isOpen && type === "deleteChannel";
  const { channel, server } = data;

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: "/api/channels/${channel?.id}",
        query: {
          serverId: server?.id,
        },
      });

      await axios.delete(url);

      onClose();

      router.refresh();
      router.push(`/servers/${server?.id}`);
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
        #{channel?.name}
      </span>{" "}
      will be permanently deleted.
    </DeleteModal>
  );
};

export default DeleteChannelModal;
