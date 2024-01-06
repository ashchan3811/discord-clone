import { generateComponents } from "@uploadthing/react";

import type { DiscordFileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<DiscordFileRouter>();
