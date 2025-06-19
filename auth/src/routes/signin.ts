import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { Password } from '../services/password';
import JWT from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = Password.compare(existingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    // Generate JWT token
    const userJwt = JWT.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // the ! tells TypeScript that this value is not null or undefined
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    }; // to beable to set cookies use https

    res.status(200).json({ status: 'success', user: existingUser });
  }
);

export { router as signinRouter };
