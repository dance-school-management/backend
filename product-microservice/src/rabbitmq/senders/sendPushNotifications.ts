import { rmqProducer } from "../..";
import { SEND_PUSH_NOTIFICATION_QUEUE } from "../queues";
import { NotificationMsgData } from "../types";

export async function sendPushNotifications(msg: NotificationMsgData) {
  rmqProducer.sendToQueue(SEND_PUSH_NOTIFICATION_QUEUE, msg);
}
