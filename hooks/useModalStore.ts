import { create } from "zustand";
import { Server } from "@prisma/client";

export type ModalType = "createServer" | "invitePeople" | "editServer";

type ModalData = {
  server?: Server;
};

type ModalStore = {
  type: ModalType | null;
  data: ModalData | null;
  isOpen: boolean;
  onOpen: (modal: ModalType, data?: ModalData) => void;
  onClose: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: null,
  onOpen: (modal, data = {}) => set({ type: modal, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false, data: null }),
}));
