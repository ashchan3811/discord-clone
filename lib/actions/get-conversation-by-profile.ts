import db from "@/lib/db";

export const getConversationByProfileId = async (
  conversationId: string,
  profileId: string,
) => {
  return db.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        {
          memberOne: {
            profileId: profileId,
          },
        },
        {
          memberTwo: {
            profileId: profileId,
          },
        },
      ],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });
};
