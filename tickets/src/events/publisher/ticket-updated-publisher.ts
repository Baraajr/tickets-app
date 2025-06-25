import { Publisher, Subjects, TicketUpdatedEvent } from '@abtickets-app/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
