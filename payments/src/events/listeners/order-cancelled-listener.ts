import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@abtickets-app/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);

    // we don't need to worry about version here

    if (!order) throw new Error('Order not found');

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    msg.ack();
  }
}
