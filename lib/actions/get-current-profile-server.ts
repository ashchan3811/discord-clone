import { getAuth } from "@clerk/nextjs/server";

import { NextApiRequest } from "next";

import db from "@/lib/db";
import { setInitialProfile } from "@/lib/actions";

export const getCurrentProfileServer = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);
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
