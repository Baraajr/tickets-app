const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
import { Collection } from 'mongodb';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

jest.setTimeout(30_000); // 30 seconds
let mongod: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'somekey';
  process.env.NODE_ENV = 'test';
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(
    collections.map((collection: Collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

global.signin = async (): Promise<string[]> => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    throw new Error('No Set-Cookie header returned from signup');
  }

  return cookie;
};
