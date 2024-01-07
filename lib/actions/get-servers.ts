import db from "@/lib/db";
import { Profile } from "@prisma/client";

export const getServers = async (profile: Profile) => {
  return db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};
