import { ExpoPushMessage } from "expo-server-sdk";
import { expo } from "../../index";
import prisma from "../../utils/prisma";
import { MsgData } from "../types";

// Saves notification to database and sends a notification to a user
// only if the user is registered for notifications
export const handleSendPushNotifications = async (msg: string) => {
  const msgData: MsgData[] = JSON.parse(msg);

  console.log(msgData);

  msgData.forEach(async (md) => {
    const isUserRegisteredForNotifications = Boolean(
      await prisma.pushToken.findFirst({
        where: {
          userId: md.userId,
        },
      }),
    );
    if (isUserRegisteredForNotifications)
      await prisma.notification.create({
        data: {
          body: md.body,
          payload: Object(md.payload),
          title: md.title,
          userId: md.userId,
        },
      });
  });

  const pushTokens = await prisma.pushToken.findMany({
    where: {
      userId: {
        in: msgData.map((md) => md.userId),
      },
    },
  });

  const pushTokensMessages = msgData.map((md) => {
    const token = pushTokens.find((pt) => pt.userId === md.userId)?.token;
    if (!token) return null;
    return { ...md, token };
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
};
