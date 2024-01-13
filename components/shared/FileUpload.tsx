"use client";

import React from "react";
import Image from "next/image";
import { Paperclip, X } from "lucide-react";

import { DiscordFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { InputPropTypes } from "@/types";

type FileUploadProps = {
  endpoint: keyof DiscordFileRouter;
} & InputPropTypes<string>;

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className={"relative h-20 w-20"}>
        <Image
          fill
          src={value}
          alt={"uploaded file"}
          className={"rounded-full"}
        />
        <button
          onClick={() => onChange("")}
          className={
            "bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          }
        >
          <X className={"h-4 w-4"} />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div
        className={
          "relative flex items-center p-2 mt-2 rounded-md bg-background/10"
        }
      >
        <Paperclip className={"h-10 w-10 fill-indigo-200 stroke-indigo-400"} />
        <a
          href={value}
          target="_blank"
          rel="noreferrer noopener"
          className={
            "ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          }
        >
          {value}
        </a>
        <button
          onClick={() => onChange("")}
          className={
            "bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          }
        >
          <X className={"h-4 w-4"} />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err) => {
        console.log(err);
      }}
    />
  );
};

export default FileUpload;
