import { Subjects } from './subjects';

// to make sure the class consistent subject and data related to that subject
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
