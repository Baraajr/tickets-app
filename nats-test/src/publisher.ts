import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('publisher connected to nats');
  const data = {
    id: 'sadasd',
    title: 'hi',
    price: 150,
  };

  const publisher = new TicketCreatedPublisher(stan);
  try {
    publisher.publish(data);
  } catch (error) {
    console.log(error);
  }
});
