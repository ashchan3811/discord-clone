"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";

import { MessageEndpoint } from "@/types";

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
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/shared/FileUpload";

const formSchema = z.object({
  fileUrl: z.string().min(1, "Attachment is required"),
});

type FormType = z.infer<typeof formSchema>;

type ServerFormProps = {
  isOpen: boolean;
  onClose: () => void;
  message?: MessageEndpoint;
};

const MessageFileUploadForm = ({
  isOpen,
  onClose,
  message,
}: ServerFormProps) => {
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: FormType) => {
    try {
      if (message) {
        const url = qs.stringifyUrl({
          url: message.apiUrl || "",
          query: {
            ...message.query,
          },
        });

        await axios.post(url, { ...values, content: values.fileUrl });

        form.reset();
        router.refresh();
        handleClose();
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={"bg-white text-black p-0 overflow-hidden"}>
        <DialogHeader className={"pt-8 px-6"}>
          <DialogTitle className={"text-2xl text-center font-bold"}>
            Add an Attachment
          </DialogTitle>
          <DialogDescription className={"text-center text-zinc-500"}>
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-8"}>
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint={"messageFile"}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  name={"fileUrl"}
                />
              </div>
            </div>

            <DialogFooter className={"bg-gray-100 px-6 py-4"}>
              <Button variant={"primary"} disabled={isSubmitting}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileUploadForm;
