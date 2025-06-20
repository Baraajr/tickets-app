import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import errorHandler from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

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

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
// unhandled routes
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
