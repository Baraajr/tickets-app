import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '@abtickets-app/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  (req: Request, res: Response) => {
    res.send({
      currentUser: req.currentUser || null,
    });
  }
);

export { router as currentUserRouter };
