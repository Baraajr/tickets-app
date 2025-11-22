import request from 'supertest';
import { app } from '../../app';

it('should respond with details about current user', async () => {
  const cookie = await global.signin();

  if (!cookie) {
    throw new Error('No Set-Cookie header returned from signup');
  }

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  console.log(response.body);
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send({})
    .expect(200);

  expect(response.body.currentUser).toBe(null);
});
