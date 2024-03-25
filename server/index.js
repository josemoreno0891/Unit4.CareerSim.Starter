const express = require("express");

const {
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
} = request('express');
const path = express();
app.use(express.json)

app.post('/api/store/login', async(req, res, next)=> {
    try {
      res.send(await authenticate(req.body));
    }
    catch(ex){
      next(ex);
    }
  });

  app.get('/api/store/me', async(req, res, next)=> {
    try {
      res.send(await findUserWithToken(req.headers.authorization));
    }
    catch(ex){
      next(ex);
    }
  });

  app.get('/api/users', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
  });

  app.get('/api/users/:id/product', async(req, res, next)=> {
    try {
      res.send(await fetchProduct(req.params.id));
    }
    catch(ex){
      next(ex);
    }
  });

  app.post('/api/users/:id/product', isLoggedIn, async(req, res, next)=> {
    try {
      res.status(201).send(await createProduct({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
  });

  app.post('/api/users/:id/carts', async(req, res, next)=> {
    try {
      res.status(201).send(await createCarts({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
  });
  app.delete('/api/users/:user_id/product/:id', async(req, res, next)=> {
    try {
      await destroyProduct({user_id: req.params.user_id, id: req.params.id });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });

  const isLoggedIn = async(req, res, next)=> {
    try {
      req.user = await findUserByToken(req.headers.authorization);
      next();
    }
    catch(ex){
      next(ex);
    }
  };

  app.use((err, req, res, next)=> {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message ? err.message : err });
  });
  const init = async()=> {
    const port = process.env.PORT || 3000;
    await client.connect();
    console.log('connected to database');
  
    await createTables();
    console.log('tables created');
  
    const [moe, lucy, ethyl, curly, foo, bar, bazz, quq, fip] = await Promise.all([
      createUser({ username: 'moe', password: 'm_pw'}),
      createUser({ username: 'lucy', password: 'l_pw'}),
      createUser({ username: 'ethyl', password: 'e_pw'}),
      createUser({ username: 'curly', password: 'c_pw'}),
      createProduct({ name: 'foo' }),
      createProduct({ name: 'bar' }),
      createProduct({ name: 'bazz' }),
      createProduct({ name: 'quq' }),
      createProduct({ name: 'fip' })
    ]);
  
    console.log(await fetchUsers());
    console.log(await fetchProducts());
  
    console.log(await fetchFavorites(moe.id));
    const favorite = await createFavorite({ user_id: moe.id, product_id: foo.id });
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  };
  init();
