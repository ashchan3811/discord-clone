import React, { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteModalProps = PropsWithChildren<{
  title: React.ReactNode;
  isOpen: boolean;
  isDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}>;

const DeleteModal = ({
  title,
  isOpen,
  onClose,
  onConfirm,
  isDisabled,
  children,
}: DeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"pt-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            {title}
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            {children}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"bg-gray-100 px-6 py-4"}>
          <div className="flex items-center justify-between w-full">
            <Button disabled={isDisabled} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button
              disabled={isDisabled}
              onClick={onConfirm}
              variant={"primary"}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
