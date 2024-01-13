"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";
import ActionTooltip from "@/components/shared/ActionTooltip";

export const ChatVideoButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isVideo = searchParams?.get("video") === "true";

  const Icon = isVideo ? Video : VideoOff;
  const tooltipLabel = isVideo ? "End Video Call" : "Start Video Call";

  const onClick = () => {
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
  };

  return (
    <ActionTooltip side={"bottom"} label={tooltipLabel}>
      <button onClick={onClick} className={"hover:opacity-75 transition mr-4"}>
        <Icon className={"h-6 w-6 text-zinc-500 dark:text-zinc-400"} />
      </button>
    </ActionTooltip>
  );
};
