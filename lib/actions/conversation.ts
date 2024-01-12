import db from "@/lib/db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  let existingConversation = await findConversation(memberOneId, memberTwoId);

  if (existingConversation) {
    return existingConversation;
  }

  existingConversation = await findConversation(memberTwoId, memberOneId);
  if (existingConversation) {
    return existingConversation;
  }

  return createNewConversation(memberOneId, memberTwoId);
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return db.conversation.findFirst({
      where: {
        AND: [
          {
            memberOneId: memberOneId,
          },
          {
            memberTwoId: memberTwoId,
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
  } catch (err) {
    console.log("findConversation err: ", err);
  }

  return null;
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    return db.conversation.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
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
  } catch (err) {
    console.log("createNewConversation err: ", err);
  }

  return null;
};
