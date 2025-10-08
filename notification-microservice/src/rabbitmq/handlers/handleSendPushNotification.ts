import { expo } from "../../index";
import { ProductType } from "../../../generated/client";
import prisma from "../../utils/prisma";

interface MsgData {
  productId: number;
  userId: string;
  productType: ProductType;
  title: string;
  description: string;
}


// Saves notification to database and sends a notification ta a user 
// only if the user is registered for notifications
export const handleSendPushNotification = async (msg: string) => {
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
          productId: md.productId,
          description: md.description,
          productType: md.productType,
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

  const messages = pushTokensMessages
    .map((ptm) => {
      if (ptm)
        return {
          to: ptm.token,
          sound: "default",
          title: ptm.title,
          body: ptm.description,
        };
      else return null;
    })
    .filter((item) => item !== null);

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Błąd wysyłania:", error);
    }
  }

  console.log("Push notifications sent");
};
