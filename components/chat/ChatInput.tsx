"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Plus, Send } from "lucide-react";
import qs from "query-string";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import { ChatTypes, MessageEndpoint } from "@/types";
import { cn } from "@/lib/utils";

import { useModalStore } from "@/hooks/useModalStore";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import EmojiPicker from "@/components/shared/EmojiPicker";
import ActionTooltip from "@/components/shared/ActionTooltip";

type ChatInputProps = {
  name: string;
  type: ChatTypes;
} & MessageEndpoint;

const formSchema = z.object({
  content: z.string().min(1),
});

type FormType = z.infer<typeof formSchema>;

const ChatInput = ({ apiUrl, query, type, name }: ChatInputProps) => {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const { onOpen } = useModalStore();

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: FormType) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, data);

      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const placeholderMap = {
    channel: `Message #${name}`,
    conversation: `Message ${name}`,
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={"content"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type={"button"}
                    onClick={() =>
                      onOpen("messageUploadFile", {
                        message: {
                          apiUrl,
                          query,
                        },
                      })
                    }
                    className={cn(
                      "absolute top-7 left-8 h-[24px] w-[24px]",
                      "bg-zinc-500 dark:bg-zinc-400",
                      "hover:bg-zinc-600 dark:hover:bg-zinc-300",
                      "transition rounded-full",
                      "p-1 flex items-center justify-center",
                    )}
                    disabled={isSubmitting}
                  >
                    <ActionTooltip label={"Add an Attachment"} side={"top"}>
                      <Plus className={"text-white dark:text-[#313338]"} />
                    </ActionTooltip>
                  </button>
                  <Input
                    disabled={isSubmitting}
                    autoComplete={"off"}
                    className={cn(
                      "px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75",
                      "border-none border-0 focus-visible:ring-0",
                      "focus-visible:ring-offset-0",
                      "text-zinc-600 dark:text-zinc-200",
                    )}
                    placeholder={placeholderMap[type]}
                    {...field}
                  />
                  <div className={"absolute top-[24px] right-8"}>
                    <div className={"flex items-center gap-x-2"}>
                      <EmojiPicker
                        onChange={(emoji) => {
                          field.onChange(`${field.value} ${emoji}`);
                        }}
                      />

                      <button
                        type={"button"}
                        onClick={form.handleSubmit(onSubmit)}
                        className={cn(
                          "text-zinc-500 dark:text-zinc-400",
                          "hover:text-zinc-600 dark:hover:text-zinc-300",
                          "transition rounded-full",
                          "p-1 flex items-center justify-center",
                        )}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className={"animate-spin"} />
                        ) : (
                          <ActionTooltip label={"Send"} side={"top"}>
                            <Send />
                          </ActionTooltip>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
