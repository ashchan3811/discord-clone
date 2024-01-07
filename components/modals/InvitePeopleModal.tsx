"use client";

import React from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import { useModalStore } from "@/hooks/useModalStore";
import { useOrigin } from "@/hooks/useOrigin";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

const InvitePeopleModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModalStore();
  const origin = useOrigin();

  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!data) return null;

  const isModalOpen = isOpen && type === "invitePeople";
  const { server } = data;

  const inviteLink = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const onGenerate = async () => {
    try {
      setIsLoading(true);

      const res = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
        {},
      );

      onOpen("invitePeople", { server: res.data });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"pt-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Invite Friends/Colleagues
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className={
              "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
            }
          >
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className={
                "bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
              }
              value={inviteLink}
              readOnly={true}
              disabled={isLoading}
            />
            <Button size={"icon"} onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className={"w-4 h-4"} />
              ) : (
                <Copy className={"w-4 h-4"} />
              )}
            </Button>
          </div>
          <Button
            variant={"link"}
            size={"sm"}
            className={"text-xs text-zinc-500 mt-4"}
            disabled={isLoading}
            onClick={onGenerate}
          >
            Generate a new invite link
            <RefreshCw className={"w-4 h-4 ml-2"} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePeopleModal;
