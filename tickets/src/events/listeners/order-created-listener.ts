import { Listener, OrderCreatedEvent, Subjects } from '@abtickets-app/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publisher/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // get the ticket
    const ticket = await Ticket.findById(data.ticket.id);

    // error if ticket not found
    if (!ticket) throw new Error('ticket not found');

    // mark ticket as reserved by setting orderId property
    ticket.set({ orderId: data.id });

    // save ticket
    await ticket.save();

    // emit ticket updated event  because we just set the orderId field (update)
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userId,
      title: ticket.title,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    // ack  the message
    msg.ack();
  }
}
