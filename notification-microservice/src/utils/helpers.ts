import { ExpoPushMessage } from "expo-server-sdk";
import prisma from "./prisma";
import { expo } from "../index";

export async function sendPushNotifications(
  userIds: string[],
  title: string,
  body: string,
  payload: Record<string, unknown>,
) {

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  const pushTokensMessages = userIds.map((uid) => {
    const token = users.find((user) => user.id === uid)?.token;
    if (!token) return null;
    return {
      title: title,
      body: body,
      payload: payload,
      token,
    };
  });

  const messages: ExpoPushMessage[] = pushTokensMessages
      .map((ptm) => {
        if (ptm)
          return {
            to: ptm.token,
            sound: "default",
            title: ptm.title,
            body: ptm.body,
            data: ptm.payload,
          };
        else return null;
      })
      .filter((item) => item !== null);

  const chunks = expo.chunkPushNotifications(messages);
  
  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error("Error sending:", error);
    }
  }

  console.log("Push notifications sent");
}
