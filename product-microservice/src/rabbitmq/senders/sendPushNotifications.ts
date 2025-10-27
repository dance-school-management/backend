import { rmqProducer } from "../..";
import { SEND_PUSH_NOTIFICATION_QUEUE } from "../queues";
import { MsgData } from "../types";

export async function sendPushNotifications(msg: MsgData) {
  rmqProducer.sendToQueue(SEND_PUSH_NOTIFICATION_QUEUE, msg);
}
