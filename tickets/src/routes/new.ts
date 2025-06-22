import express, { Request, Response } from 'express';
import { requireAuth, NotAuthorizedError } from '@abtickets-app/common';
import { body } from 'express-validator';
import { validateRequest } from '@abtickets-app/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();
    res.status(201).json({
      ticket,
    });
  }
);

export { router as createTicketRouter };
