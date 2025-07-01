import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@abtickets-app/common';
import { deleteOrderRouter } from './routes/delete';
import { createOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';

const app = express();

app.set('trust proxy', true); // Trust the reverse proxy (nginx)
app.use(morgan('dev'));
app.use(express.json());
app.use(
  cookieSession({
    signed: false, // No encryption
    secure: process.env.NODE_ENV !== 'test', // Only use cookies over HTTPS
  })
);

app.use(currentUser);
app.use(deleteOrderRouter);
app.use(createOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);

// unhandled routes
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
