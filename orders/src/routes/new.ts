import express, { Request, Response } from 'express';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@abtickets-app/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .withMessage('Ticket id must be provided')
      .isMongoId()
      .withMessage('Please provide a valid cmongo id'),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure it is not reserved
    // by finding an order by the ticket with any status but not cancelled
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('ticket is already reserved');
    }

    // calulate the expiration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // create the order
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    // save to db
    await order.save();
    //publish an event of order created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
