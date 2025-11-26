import { Listener, OrderCreatedEvent, Subjects } from '@abtickets-app/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting this ${delay} milliseconds before processing job`);
    // this should be delayed
    await expirationQueue.add(
      { orderId: data.id },
      {
        delay: delay, // this is the delay before processing job from redis
      }
    );

    msg.ack();
  }
}
