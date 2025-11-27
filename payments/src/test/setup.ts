const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
import { Collection } from 'mongodb';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

jest.setTimeout(30_000); // 30 seconds

jest.mock('../nats-wrapper.ts'); // to use a fake implementation instead of this file

process.env.STRIPE_KEY = 'put your secret here';

let mongod: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'somekey';
  process.env.NODE_ENV = 'test';
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  await Promise.all(
    collections.map((collection: Collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

global.signin = (id?: string) => {
  // build paylod {email id}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object { jwt: MY_JWT}
  const session = {
    jwt: token,
  };
  // turn that into json
  const sessionJSON = JSON.stringify(session);
  // convert to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string  the cookie with data express:sess=asdasdsadasd
  return [`session=${base64}`];
};
