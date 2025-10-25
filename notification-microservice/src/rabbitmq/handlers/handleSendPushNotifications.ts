import prisma from "../../utils/prisma";
import { MsgData } from "../types";
import { sendPushNotifications } from "../../utils/helpers";

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

  const usersRegisteredForNotifications = (
    await prisma.user.findMany({
      where: {
        id: {
          in: msgData.userIds,
        },
        hasEnabledNotifications: true
      },
    })
  ).map((user) => user.id);

  await prisma.notificationsOnUsers.createMany({
    data: usersRegisteredForNotifications.map((userId) => ({
      notificationId: notification.id,
      userId,
    })),
  });

  await sendPushNotifications(
    usersRegisteredForNotifications,
    msgData.title,
    msgData.body,
    msgData.payload,
  );
};
