//imports
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/online_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
const { createUser } = require('../../../block36/Unit4.Block36.Workshop.Starter/server/db');

const createTables = async() => {
    const SQL =`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS cartItems;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS orderItems;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url TEXT
    );
    CREATE TABLE carts(
      id UUID PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id)
    );

    CREATE TABLE cartItems(
      id UUID PRIMARY KEY,
      cart_id INTEGER NOT NULL REFERENCES carts(id),
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL
    );
    CREATE TABLE order(
      id UUID PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      total_amount DECIMAL(10, 2) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      );
    CREATE TABLE orderItems(
      id UUID PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id),
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL
    );
  `;
    
    await client.query(SQL);
}

createUser = async({username, password}) => {
    const SQL = `
    INSERT INTO users(id, user_id) VALUES($1, $2, $3) RETURNING *
    `;
    const response =  await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
    return response.row[0];
};
const fetchUsers = async()=> {
    const SQL = `
      SELECT id, username FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

createProduct = async({name}) => {
    const SQL = `
    INSERT INTO products(id, name, description, price, image_url) VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const response =  await client.query(SQL, [uuid.v4(), name]);
    return response.row[0];
};
destroyProduct = async({}) => {
    const SQL = `
    DELETE FROM product WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
}
fetchProduct = async({}) => {
    const SQL = `
      SELECT id, name,description, price, image_url FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

createCarts = async({username, password}) => {
    const SQL = `
    INSERT INTO carts(id, user_id) VALUES($1, $2) RETURNING *
    `;
    const response =  await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
    return response.row[0];
};
const fetchCarts = async()=> {
    const SQL = `
      SELECT * FROM carts;
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

createCartItems = async({}) => {
    const SQL = `
    INSERT INTO cartItems(id, cart_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response =  await client.query(SQL, [uuid.v4(), usename, await bcrypt.hash(password, 5)]);
    return response.row[0];
};

createOrder = async({}) => {
    const SQL = `
    INSERT INTO users(id, user_id, total_amount, status) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response =  await client.query(SQL, [uuid.v4(), usename, await bcrypt.hash(password, 5)]);
    return response.row[0];
};
createOrderItems = async({}) => {
    const SQL = `
    INSERT INTO orderItems(id, order_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response =  await client.query(SQL, [uuid.v4(), usename, await bcrypt.hash(password, 5)]);
    return response.row[0];
};
const authenticate = async({ username, password })=> {
    const SQL = `
      SELECT id, password FROM users WHERE username=$1;
    `;
    const response = await client.query(SQL, [username]);
    if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password))=== false){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    const token = await jwt.sign({ id: response.rows[0].id}, JWT);
    return { token: token };
  };
  
  const findUserWithToken = async(token, JWT)=> {
    let id ;
    try{
        const payload = await jwt.verify(token, JWT);
        id = payload,id;
    }catch(ex){
        const error = Error('not authorized');
        error.status = 401;
        throw error;
    }
    const SQL = `
      SELECT id, username FROM users WHERE id=$1;
    `;
    const response = await client.query(SQL, [id]);
    if(!response.rows.length){
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  };

module.exports = {
    client,
    createTables,
    createUser,
    createProduct,
    createCarts,
    createCartItems,
    createOrderItems,
    destroyProduct,
    fetchProduct,
    authenticate,
    fetchUsers,
    fetchCarts,
    findUserWithToken
}

