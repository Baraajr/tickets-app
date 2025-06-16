import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import errorHandler from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
// unhandled routes
app.all('*', async () => {
  console.log('Unhandled route:');
  throw new NotFoundError();
});

app.use(errorHandler);
app.listen(3000, () => {
  console.log('Auth service is running on port 3000');
});
