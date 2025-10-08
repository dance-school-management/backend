import { rmqProducer } from "../..";
import { SEND_PUSH_NOTIFICATION_QUEUE } from "../queues";

export interface PushNotificationMsgData {
  productId: number;
  userId: string;
  productType: "COURSE" | "CLASS" | "EVENT";
  title: string;
  description: string;
}

export async function sendPushNotifications(msg: PushNotificationMsgData[]) {
  rmqProducer.sendToQueue(SEND_PUSH_NOTIFICATION_QUEUE, msg);
}
