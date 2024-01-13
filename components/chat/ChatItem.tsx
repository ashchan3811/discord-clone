"use client";

import React, { useEffect } from "react";
import { Member, MemberRole } from "@prisma/client";
import Image from "next/image";
import { Edit, Paperclip, Trash } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import toast from "react-hot-toast";

import { MemberWithProfile } from "@/types";
import { manageMembersRoleIconMap } from "@/types/icon-maps";

import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import UserAvatar from "@/components/shared/UserAvatar";
import ActionTooltip from "@/components/shared/ActionTooltip";

type ChatItemProps = {
  id: string;
  content: string;
  member: MemberWithProfile;
  timestamp: string;
  fileUrl?: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const formSchema = z.object({
  content: z.string().min(1),
});

type FormType = z.infer<typeof formSchema>;

const ChatItem = ({
  id,
  content,
  fileUrl,
  socketUrl,
  socketQuery,
  currentMember,
  member,
  timestamp,
  deleted,
  isUpdated,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  useEffect(() => {
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", escapeHandler);

    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, []);

  const { isSubmitting } = form.formState;

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember?.role === MemberRole.ADMIN;
  const isModerator = currentMember?.role === MemberRole.MODERATOR;
  const isOwner = currentMember?.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const onSubmit = async (values: FormType) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      const res = await axios.patch(url, values);
      if (res) {
        form.reset();
        setIsEditing(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className={cn(
        "relative group flex items-center",
        "hover:bg-black/5 p-4 transition w-full",
      )}
    >
      <div className={cn("group flex gap-x-2 items-start w-full")}>
        <div className={"cursor-pointer hover:drop-shadow-md transition"}>
          <UserAvatar src={member.profile?.imageUrl} />
        </div>
        <div className={cn("flex flex-col w-full")}>
          <div className={"flex items-center gap-x-2"}>
            <div className={"flex items-center"}>
              <p
                className={
                  "font-semibold text-xm hover:underline cursor-pointer"
                }
              >
                {member.profile?.name}
              </p>
              <ActionTooltip label={member.role}>
                {manageMembersRoleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className={"text-xs text-zinc-500 dark:text-zinc-400"}>
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "relative aspect-square rounded-md",
                "mt-2 overflow-hidden border",
                "flex items-center",
                "bg-secondary h-44 w-44",
              )}
            >
              <Image
                fill
                src={fileUrl}
                alt={content}
                className={"object-cover"}
              />
            </a>
          )}

          {isPDF && (
            <div
              className={
                "relative flex items-center p-2 mt-2 rounded-md bg-background/10"
              }
            >
              <Paperclip
                className={"h-10 w-10 fill-indigo-200 stroke-indigo-400"}
              />
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={
                  "ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                }
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1",
              )}
            >
              {content}

              {isUpdated && !deleted && (
                <span
                  className={
                    "text-[10px] mx-2 text-zinc-500 dark:text-zinc-400"
                  }
                >
                  (edited)
                </span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex items-center", "w-full gap-x-2 mt-2")}
              >
                <FormField
                  control={form.control}
                  name={"content"}
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormControl>
                        <div className={"relative w-full"}>
                          <Input
                            className={cn(
                              "p-2 bg-zinc-700/90 dark:bg-zinc-700/75",
                              "border-none border-0",
                              "focus-visible:ring-0",
                              "focus-visible:ring-offset-0",
                              "text-zinc-600 dark:text-zinc-200",
                            )}
                            placeholder={"Edited message"}
                            {...field}
                            autoComplete={"off"}
                            disabled={isSubmitting}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button size={"sm"} variant={"primary"} disabled={isSubmitting}>
                  {isSubmitting ? "Saving" : "Save"}
                </Button>
              </form>

              <span className={"text-[10px] mt-1 dark:text-zinc-400"}>
                Press escape to cancel, enter to send
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className={cn(
            "hidden group-hover:flex items-center",
            "gap-x-2 absolute p-1 -top-2 right-5",
            "bg-white dark:bg-zinc-800 border rounded-sm",
          )}
        >
          {canEditMessage && (
            <ActionTooltip label={"Edit"}>
              <Edit
                className={cn(
                  "cursor-pointer ml-auto w-4 h-4",
                  "text-zinc-500 dark:text-zinc-400",
                  "hover:text-zinc-600 dark:hover:text-zinc-300",
                  "transition",
                )}
                onClick={() => {
                  setIsEditing(true);
                }}
              />
            </ActionTooltip>
          )}

          <ActionTooltip label={"Delete"}>
            <Trash
              className={cn(
                "cursor-pointer ml-auto w-4 h-4",
                "text-rose-500 dark:text-rose-400",
                "hover:text-rose-600 dark:hover:text-rose-300",
                "transition",
              )}
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
