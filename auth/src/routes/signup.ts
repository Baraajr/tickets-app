import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import Jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@abtickets-app/common';
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
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use'); // This should be a custom error, e.g., BadRequestError
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT token
    const userJwt = Jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // the ! tells TypeScript that this value is not null or undefined
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    }; // to beable to set cookies use https

    res.status(201).json({ status: 'success', user });
  }
);

export { router as signupRouter };
