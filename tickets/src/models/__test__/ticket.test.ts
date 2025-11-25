import { Ticket } from '../tickets';

it('implements optimistic concurrency control ', async () => {
  // create ticket
  const ticket = Ticket.build({
    title: 'asd',
    price: 15,
    userId: '123',
  });

  // save it to db
  await ticket.save();

  // fetch it twice
  const firstInstance = await Ticket.findById(ticket.id);
  const seconInstance = await Ticket.findById(ticket.id);

  // make two seperate changes to fetched tickets
  firstInstance?.set({ price: 10 });
  seconInstance?.set({ price: 20 });

  // save first fetched ticket
  await firstInstance?.save();
  // save second fetched ticket
  try {
    await seconInstance?.save();
  } catch (err) {
    return;
  }

  throw new Error("shouldn't reach this point ");
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
