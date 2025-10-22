import { ExpoPushMessage } from "expo-server-sdk";
import { expo } from "../../index";
import prisma from "../../utils/prisma";
import { MsgData } from "../types";

// Saves notification to database and sends a notification to a user
// only if the user is registered for notifications
export const handleSendPushNotifications = async (msg: string) => {
  const msgData: MsgData = JSON.parse(msg);

  console.log(msgData);

  const notification = await prisma.notification.create({
    data: {
      body: msgData.body,
      payload: Object(msgData.payload),
      title: msgData.title,
    },
  });

  msgData.userIds.forEach(async (uid) => {
    const isUserRegisteredForNotifications = Boolean(
      await prisma.pushToken.findFirst({
        where: {
          userId: uid,
        },
      }),
    );
    if (isUserRegisteredForNotifications)
      await prisma.notificationsOnTokens.create({
        data: {
          notificationId: notification.id,
          userId: uid,
        },
      });
  });

  const pushTokens = await prisma.pushToken.findMany({
    where: {
      userId: {
        in: msgData.userIds,
      },
    },
  });

  const pushTokensMessages = msgData.userIds.map((uid) => {
    const token = pushTokens.find((pt) => pt.userId === uid)?.token;
    if (!token) return null;
    return {
      title: msgData.title,
      body: msgData.body,
      payload: msgData.payload,
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
};
