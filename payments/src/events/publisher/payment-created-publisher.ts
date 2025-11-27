import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@abtickets-app/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
