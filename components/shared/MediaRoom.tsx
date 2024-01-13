"use client";

import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

type MediaRoomProps = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video") === "true";

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [user, chatId]);

  if (token === "") {
    return (
      <div className={"flex flex-col flex-1 justify-center items-center"}>
        <Loader2 className={"h-7 w-7 text-zinc-500 animate-spin my-5"} />
        <p className={"text-xs text-zinc-500 dark:text-zinc-400"}>Loading...</p>
      </div>
    );
  }

  const onDisconnected = () => {
    if (isVideo) {
      const url = qs.stringifyUrl(
        {
          url: pathname || "",
          query: {
            video: isVideo ? undefined : true,
          },
        },
        { skipNull: true },
      );

      router.push(url);
    }
  };

  return (
    <LiveKitRoom
      data-lk-theme="default"
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={onDisconnected}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
