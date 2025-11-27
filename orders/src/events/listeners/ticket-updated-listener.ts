import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@abtickets-app/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  // create ticket and save it to order database
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.log('Event data received:', data);

    const { id, title, price } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
