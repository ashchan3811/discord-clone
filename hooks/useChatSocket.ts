import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@prisma/client";

import { MessageWithMemberWithProfile } from "@/types";

import { useSocket } from "@/components/providers/SocketProvider";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type IQueryData = {
  pages: { items: Message[] }[];
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: IQueryData) => {
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return oldData;
        }

        const newData = oldData.pages.map((page) => {
          return {
            ...page,
            items: page.items.map((m) => {
              if (m.id === message.id) {
                return message;
              }

              return m;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: IQueryData) => {
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return { pages: [{ items: [message] }] };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, [queryClient, queryKey, socket, updateKey, addKey]);

  return {};
};
