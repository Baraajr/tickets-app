import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@abtickets-app/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
