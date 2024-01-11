import { create } from "zustand";
import { Channel, ChannelType, Server } from "@prisma/client";

export type ModalType =
  | "createServer"
  | "invitePeople"
  | "editServer"
  | "manageMembers"
  | "leaveServer"
  | "deleteServer"
  | "createChannel"
  | "editChannel"
  | "deleteChannel";

type ModalData = {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
};

type ModalStore = {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (modal: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (modal, data = {}) => set({ type: modal, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));
