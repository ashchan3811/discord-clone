"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Channel, ChannelType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import qs from "query-string";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Channel name is required")
    .refine((name) => name != "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

type FormType = z.infer<typeof formSchema>;

type ChannelFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  channel?: Channel;
  channelType?: ChannelType;
};

const ChannelForm = ({
  isOpen,
  onClose,
  onFormSubmit,
  channel,
  channelType,
}: ChannelFormProps) => {
  const router = useRouter();
  const params = useParams();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }

    if (channelType) {
      form.setValue("type", channelType);
    }
  }, [channel, form, channelType]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: FormType) => {
    try {
      if (channel) {
        const url = qs.stringifyUrl({
          url: `/api/channels/${channel?.id}`,
          query: {
            serverId: params.serverId,
          },
        });

        const res = await axios.patch(url, values);
        if (res) {
          form.reset();
          router.refresh();

          onFormSubmit();
        }
      } else {
        const url = qs.stringifyUrl({
          url: "/api/channels",
          query: {
            serverId: params.serverId,
          },
        });

        const res = await axios.post(url, values);
        if (res) {
          form.reset();
          router.refresh();

          onFormSubmit();
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"pt-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-8"}>
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                      }
                    >
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder={"Enter Channel Name"}
                        className={
                          "bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"type"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={
                        "uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                      }
                    >
                      Channel Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select Channel Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className={"cursor-pointer capitalize"}
                            >
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                        <FormMessage />
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className={"bg-gray-100 px-6 py-4"}>
              <Button variant={"primary"} disabled={isSubmitting}>
                {channel ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelForm;
