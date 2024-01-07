import React from "react";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { getCurrentProfile, getServers } from "@/lib/actions";

import NavigationAction from "@/components/navigation/NavigationAction";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "@/components/navigation/NavigationItem";
import { ThemeModeToggle } from "@/components/shared/ThemeModeToggle";

const NavigationSidebar = async () => {
  const profile = await getCurrentProfile();
  if (!profile) {
    return redirect("/");
  }

  const servers = await getServers(profile);

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
