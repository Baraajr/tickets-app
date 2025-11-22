import { OrderCreatedEvent, Publisher, Subjects } from '@abtickets-app/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
