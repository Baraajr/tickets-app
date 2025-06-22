import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
it('returns 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/tickets/${id}`).send({}).expect(404);
});

it('returns a ticket if it exsists', async () => {
  const title = 'title';
  const price = 150;
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const getRes = await request(app).get(`/api/tickets/${res.body.ticket.id}`);

  expect(getRes.body.title).toEqual(title);
  expect(getRes.body.price).toEqual(price);
});
