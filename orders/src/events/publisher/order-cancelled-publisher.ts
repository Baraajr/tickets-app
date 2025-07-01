import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@abtickets-app/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
