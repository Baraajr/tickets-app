import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload; // Type definition for currentUser
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.session?.jwt) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload; // Type assertion for payload
    req.currentUser = payload; // Assigning the payload to currentUser
  } catch (error) {}
  next();
};
