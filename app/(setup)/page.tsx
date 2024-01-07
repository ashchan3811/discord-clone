import React from "react";
import { redirect } from "next/navigation";

import { setInitialProfile } from "@/lib/actions/set-initial-profile";
import db from "@/lib/db";
import InitialServerModal from "@/components/modals/InitialServerModal";

const SetupPage = async () => {
  const profile = await setInitialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <InitialServerModal />;
};

export default SetupPage;
