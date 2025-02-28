const Koa = require('koa');
const { bodyParser } = require('@koa/bodyparser');
const cors = require('@koa/cors');
const uuid = require('uuid');
const format = require('date-format');

const app = new Koa();

const port = 3000;

let tickets = [];

app.use(cors());

app.use(cors({
  origin(ctx) {
    return ctx.get('Origin') || '*';
  },
}));

app.use(bodyParser());

app.use(async (ctx) => {
  ctx.body = ctx.request.body;

  // console.log(ctx.request);
  const { method } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      ctx.response.status = 200;
      ctx.response.body = tickets.map((el) => ({
        id: el.id,
        name: el.name,
        description: el.description,
        status: el.status,
        created: el.created,
      }));
      return;
    case 'ticketById':
      { ctx.response.status = 200;
        const findTicket = tickets.filter((el) => el.id === ctx.request.query.id);
        if (findTicket.length === 1) {
          ctx.response.status = 200;
          ctx.response.body = [...findTicket[0]];
        } else {
          ctx.response.status = 404;
        }
      }
      return;
    case 'createTicket':
    { const gId = uuid.v4();
      const checkExist = tickets.filter((el) => el.name === ctx.body.name
      && el.description === ctx.body.description);
      if (checkExist.length === 0) {
        tickets.push(
          {
            id: gId,
            name: ctx.body.name,
            description: ctx.body.description,
            status: ctx.body.status,
            created: format('dd.MM.yyyy hh:mm', new Date()),
          },
        );
        ctx.response.status = 200;
        ctx.response.body = { id: gId, message: 'Ticket successfully added.' };
      }
      return;
    }
    case 'updateTicket':
    { const ticket = tickets.filter((el) => el.id === ctx.body.id);
      if (ticket) {
        ticket[0].name = ctx.body.name;
        ticket[0].description = ctx.body.description;
        ticket[0].status = ctx.body.status;
        ctx.response.status = 200;
        ctx.response.body = { message: 'Ticket successfully updated.' };
      }
      return;
    }
    case 'updateStatusTicket':
    { const ticket1 = tickets.filter((el) => el.id === ctx.body.id);
      if (ticket1) {
        ticket1[0].status = ctx.body.status;
        ctx.response.status = 200;
        ctx.response.body = { message: 'Ticket status successfully updated.' };
      }
      return;
    }
    case 'deleteTicket':
    { tickets = tickets.filter((el) => el.id !== ctx.request.query.id);
      ctx.response.status = 200;
      ctx.response.body = { message: 'Ticket successfully deleted.' };
      return;
    }
    default:
      ctx.response.status = 404;
  }
});

app.listen(port, (err) => {
  if (err) {
    // console.log(err);

  }

  // console.log(`Server is listening to ${port}`);
});
