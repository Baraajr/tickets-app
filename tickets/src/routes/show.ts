import express, { Request, Response } from 'express';
import { Ticket } from '../models/tickets';
import { NotFoundError } from '@abtickets-app/common';
import { param } from 'express-validator';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  [param('id').isMongoId().withMessage('please provide a valid id')],
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { router as showTicketRoute };
