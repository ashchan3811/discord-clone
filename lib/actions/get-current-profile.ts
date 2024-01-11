import { auth } from "@clerk/nextjs";
import db from "@/lib/db";

import { setInitialProfile } from "@/lib/actions/set-initial-profile";

export const getCurrentProfile = async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  if (profile) {
    return profile;
  }

  await setInitialProfile();

  return db.profile.findUnique({
    where: {
      userId,
    },
  });
};
