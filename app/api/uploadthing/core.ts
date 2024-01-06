import { auth } from "@clerk/nextjs";

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const discordFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("serverImage Upload complete");
    }),
  messageFile: f(["image", "pdf", "video", "audio", "text"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("messageFile Upload complete");
    }),
} satisfies FileRouter;

export type DiscordFileRouter = typeof discordFileRouter;
