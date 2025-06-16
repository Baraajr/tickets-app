import express, { NextFunction } from 'express';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    console.log('Creating a user');
    throw new DatabaseConnectionError();
  }
);

export { router as signupRouter };
