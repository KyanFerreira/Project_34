const express = require('express');
const app = express();
app.use(express.json());

const {client, createTables, 
    createCustomer, createResturant, fetchCustomers, 
    fetchResturants, createReservations, fetchreservations, destroyReservations} = require('./db');


//Get Customers
app.get('/api/customers', async(req, res, next)=> {
    try {
      res.send(await fetchCustomers());
    }
    catch(ex){
      next(ex);
    }
  });

   // Get Resturants
   app.get('/api/restaurants', async(req, res, next)=> {
    try {
      res.send(await fetchResturants());
    }
    catch(ex){
      next(ex);
    }
  });

  // Get reservations
  app.get('/api/reservations', async(req, res, next)=> {
    try {
      res.send(await fetchreservations());
    }
    catch(ex){
      next(ex);
    }
  });  

  // Create reservations [NEED TO FIGURE THIS OUT]
app.post('/api/reservations',  async(req, res, next)=> {
    try {
        res.status(201).send(await createReservations({ customer_id: req.body.customer_id, resturant_id: req.body.resturant_id, date: req.body.date, party_count: req.body.party_count}));
    }
    catch(ex){
        next(ex);
    }
});
  
  // Delete reservations
  app.delete('/api/reservations/:id',  async(req, res, next)=> {
    try {
        await destroyReservations({  id: req.params.id});
        res.sendStatus(204);
    }
    catch(ex){
        next(ex);
    }
});



const init = async()=> {
console.log('connecting to database');
await client.connect();
console.log('connected to database');
await createTables();
console.log('Tables Created');
const [kyan, margie, lorenzo, gerald, JaneDoe, RuthChris, JCKitchen] = await Promise.all([
    createCustomer({ name: 'Kyan'}),
    createCustomer({ name: 'Margie'}),
    createCustomer({ name: 'Lorenzo'}),
    createCustomer({ name: 'Gerald'}),
    createResturant({ name: 'JaneDoe'}),
    createResturant({ name: 'RuthChris'}),
    createResturant({ name: 'JCKitchen'}),
    ]);
    console.log(await fetchCustomers());
console.log(await fetchResturants());

const [reservation, reservation2] = await Promise.all([
    createReservations({
    customer_id: kyan.id,
    resturant_id: JaneDoe.id,
    date: '02/14/2024',
    party_count: 2
    }),
    createReservations({
        customer_id: margie.id,
        resturant_id: JCKitchen.id,
        date: '02/28/2024',
        party_count: 4
    }),
    ]);
    console.log(await fetchreservations());
    await destroyReservations({ id: reservation.id, customer_id: reservation.customer_id});
};

init();

const port = process.env.PORT || 3000;
    app.listen(port, ()=> {
        console.log(`listening on port ${port}`);
        console.log('some curl commands to test');
        console.log(`curl localhost:${port}/api/users`);
        console.log(`curl localhost:${port}/api/places`);
       console.log(`curl localhost:${port}/api/vacations`);
     });