import React from "react";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/actions/get-current-profile";
import db from "@/lib/db";

import NavigationActions from "@/components/navigation/NavigationActions";

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
      <NavigationActions />
    </div>
  );
};

export default NavigationSidebar;
