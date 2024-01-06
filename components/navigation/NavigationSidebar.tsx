import React from "react";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/actions/get-current-profile";
import db from "@/lib/db";

import NavigationAction from "@/components/navigation/NavigationAction";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/NavigationItem";
import { ThemeModeToggle } from "@/components/shared/ThemeModeToggle";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const profile = await getCurrentProfile();
  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div
      className={
        "space-y-4 flex flex-col items-center h-full text-primary dark:bg-[#1E1F22] py-3"
      }
    >
      <NavigationAction />
      <Separator
        className={
          "h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
        }
      />

      <ScrollArea className={"flex-1 w-full"}>
        {servers.map((server) => (
          <div key={server.id} className={"mb-4"}>
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ThemeModeToggle size={"sidebar"} />
        <UserButton
          afterSignOutUrl={"/"}
          appearance={{
            elements: {
              avatarBox: "h-48 w-48",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
