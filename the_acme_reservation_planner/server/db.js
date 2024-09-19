const pg = require("pg");
const client = new pg.Client("postgres://localhost/the_acme_reservation_planner");
//Create Customer
const createCustomer = async(name)=> {
    const SQL = `
      INSERT INTO customers( name) VALUES($1) RETURNING *
    `;
    const response = await client.query(SQL, [ name]);
    return response.rows[0];
  };
  // Create Resturant Function
  const createResturant = async(name)=> {
    const SQL = `
      INSERT INTO restaurants( name) VALUES($1) RETURNING *
    `;
    const response = await client.query(SQL, [ name]);
    return response.rows[0];
  };
  //Fetch Customer Function
  const fetchCustomers = async()=> {
    const SQL = `
  SELECT *
  FROM customers
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  // Fetch Resturant Function
  const fetchResturants = async()=> {
    const SQL = `
  SELECT *
  FROM restaurants
    `;
    const response = await client.query(SQL);
    return response.rows;
  };   

  // Create reservations
  const createReservations = async({ resturant_id, customer_id, date, party_count})=> {
    const SQL = `
      INSERT INTO reservations(resturant_id, customer_id, date, party_count) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [ resturant_id, customer_id, date, party_count]);
    return response.rows[0];
  };

  // Fetch reservations
  const fetchreservations = async()=> {
    const SQL = `
  SELECT *
  FROM reservations
    `;
    const response = await client.query(SQL);
    return response.rows;
  }; 
//Destroy Reservations
  const destroyReservations = async({ id}) => {
    const SQL = `
        DELETE FROM Reservations
        WHERE id = $1
    `;
    await client.query(SQL, [id]);
}; 



const createTables = async()=> {
    const SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;
    CREATE TABLE customers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE restaurants(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE reservations(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    party_count INT NOT NULL,
    customer_id INT REFERENCES customers(id) NOT NULL,
    resturant_id INT REFERENCES restaurants(id) NOT NULL
    );
    `;
    
    await client.query(SQL);

};



module.exports = {client, createTables, createCustomer, createResturant, 
    fetchCustomers, fetchResturants, createReservations, fetchreservations, destroyReservations};