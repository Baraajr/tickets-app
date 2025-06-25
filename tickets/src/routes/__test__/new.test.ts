import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';

it('has a routehandler listening to /api/tickets for post request', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.status).not.toBe(404);
});

it('can only be accessed if user is signed in ', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('does not return 401 if the user is signed in  ', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(res.status).not.toEqual(401);
});

it('return error if an invalid title provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 110,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 110,
    })
    .expect(400);
});

it('return error if an invalid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sadasdasd',
      price: -15,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'sadasdasd',
    })
    .expect(400);
});
it('create a ticket if valid inputs provided', async () => {
  const title = 'sadasdasd';
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 150,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(150);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  const title = 'ticket';
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 150,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
