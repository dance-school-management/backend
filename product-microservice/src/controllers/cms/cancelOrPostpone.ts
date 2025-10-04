import { Request, Response } from "express";
import { rmqProducer } from "../../rabbitmq/producer";
import { NOTIFICATIONS_QUEUE } from "../../rabbitmq/queues";

export async function cancelClass(req: Request<{}, {}, {}>, res: Response) {
  rmqProducer.sendToQueue(NOTIFICATIONS_QUEUE, "This is a test message");
  res.sendStatus(200)
}
