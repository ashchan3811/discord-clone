"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Server } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const formSchema = z.object({
  name: z.string().min(1, "Channel name is required"),
});

type FormType = z.infer<typeof formSchema>;

type ChannelFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmit: () => void;
  server?: Server;
};

const ChannelForm = ({
  isOpen,
  onClose,
  onFormSubmit,
  server,
}: ChannelFormProps) => {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
    }
  }, [server, form]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: FormType) => {
    try {
      if (server) {
        const res = await axios.patch(`/api/servers/${server?.id}`, values);
        if (res) {
          form.reset();
          router.refresh();

          onFormSubmit();
        }
      } else {
        const res = await axios.post("/api/servers", values);
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
            Customize your Channel
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Give your server a personality with a name and an avatar. You can
            always change these later.
          </DialogDescription>
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
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder={"Enter server Name"}
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
            </div>

            <DialogFooter className={"bg-gray-100 px-6 py-4"}>
              <Button variant={"primary"} disabled={isSubmitting}>
                {server ? "Save" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelForm;
