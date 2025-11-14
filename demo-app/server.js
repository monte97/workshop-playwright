const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { evaluateBooleanControl } = require('./rules');

const app = express();
const PORT = 3000;

// Helper function for async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'TechStore API',
      version: '1.0.0',
      description: 'API documentation for the TechStore e-commerce demo application.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server.js'], // Files to scan for API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'playwright-demo-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serve static files
app.use(express.static('public'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Load data
let products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

// In-memory storage for carts and orders
const carts = {};
const orders = [];

// ============================================
// API ROUTES
// ============================================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with optional filters
 *     description: Returns a list of products, with optional filtering by category, search term, and sorting.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price-asc, price-desc, name]
 *         description: Sort order.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;

  let filteredProducts = [...products];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // Search by name or description
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort products
  if (sort === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json(filteredProducts);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: The product details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 */
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all product categories
 *     responses:
 *       200:
 *         description: A list of unique category names.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
 *     responses:
 *       201:
 *         description: The created product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Missing required fields.
 */
app.post('/api/products', async (req, res) => {
  // Introduce a random delay 70% of the time to simulate network latency
  if (Math.random() < 0.7) {
    const delaySeconds = 3;
    console.log(`[API DELAY] Adding a ${delaySeconds}s delay to POST /api/products`);
    await delay(delaySeconds * 1000);
  }

  const { name, description, price, category, image, stock } = req.body;

  // Enhanced validation
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required fields.' });
  }

  // Check for duplicate product name (case-insensitive)
  const existingProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (existingProduct) {
    return res.status(409).json({ error: `Product name "${name}" is already in use.` });
  }

  // Generate new ID
  const newId = Math.max(...products.map(p => p.id), 0) + 1;

  const newProduct = {
    id: newId,
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    image: image || 'https://via.placeholder.com/300x200?text=Product',
    stock: stock !== undefined ? parseInt(stock) : 0
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: The updated product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 */
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, description, price, category, image, stock } = req.body;

  // Update only provided fields
  if (name !== undefined) products[productIndex].name = name;
  if (description !== undefined) products[productIndex].description = description;
  if (price !== undefined) products[productIndex].price = parseFloat(price);
  if (category !== undefined) products[productIndex].category = category;
  if (image !== undefined) products[productIndex].image = image;
  if (stock !== undefined) products[productIndex].stock = parseInt(stock);

  res.json(products[productIndex]);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: Deletion successful.
 *       404:
 *         description: Product not found.
 */
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json({ success: true, product: deletedProduct });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid credentials.
 */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout a user
 *     responses:
 *       200:
 *         description: Logout successful.
 */
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user info
 *     responses:
 *       200:
 *         description: Current user data.
 *       401:
 *         description: Not authenticated.
 */
app.get('/api/auth/me', (req, res) => {
  if (req.session.userId) {
    const user = users.find(u => u.id === req.session.userId);
    if (user) {
      res.json({
        id: user.id,
        email: user.email,
        name: user.name
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     responses:
 *       200:
 *         description: The user's cart.
 */
app.get('/api/cart', (req, res) => {
  const sessionId = req.session.id;
  const cart = carts[sessionId] || [];
  res.json(cart);
});

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add an item to the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added successfully.
 *       404:
 *         description: Product not found.
 */
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const sessionId = req.session.id;

  const product = products.find(p => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!carts[sessionId]) {
    carts[sessionId] = [];
  }

  const existingItem = carts[sessionId].find(item => item.productId === parseInt(productId));

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[sessionId].push({
      productId: parseInt(productId),
      quantity,
      product
    });
  }

  res.json({ success: true, cart: carts[sessionId] });
});

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quantity updated.
 *       404:
 *         description: Cart or item not found.
 */
app.put('/api/cart/:productId', (req, res) => {
  const { quantity } = req.body;
  const sessionId = req.session.id;
  const productId = parseInt(req.params.productId);

  if (!carts[sessionId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const item = carts[sessionId].find(item => item.productId === productId);

  if (item) {
    if (quantity <= 0) {
      carts[sessionId] = carts[sessionId].filter(item => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }
    res.json({ success: true, cart: carts[sessionId] });
  } else {
    res.status(404).json({ error: 'Item not found in cart' });
  }
});

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed.
 *       404:
 *         description: Cart not found.
 */
app.delete('/api/cart/:productId', (req, res) => {
  const sessionId = req.session.id;
  const productId = parseInt(req.params.productId);

  if (!carts[sessionId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  carts[sessionId] = carts[sessionId].filter(item => item.productId !== productId);
  res.json({ success: true, cart: carts[sessionId] });
});

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Process checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Checkout'
 *     responses:
 *       200:
 *         description: Checkout successful.
 *       400:
 *         description: Cart is empty or missing fields.
 *       401:
 *         description: User not logged in.
 *       403:
 *         description: User not authorized to checkout.
 */
app.post('/api/checkout', (req, res) => {
  const sessionId = req.session.id;
  const cart = carts[sessionId];

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please login to checkout' });
  }

  const user = users.find(u => u.id === req.session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const canCheckout = evaluateBooleanControl(user, 'canCheckout');
  if (canCheckout === false) {
    return res.status(403).json({ error: 'You are not authorized to checkout.' });
  }

  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Create order
  const order = {
    id: orders.length + 1,
    userId: req.session.userId,
    items: cart.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    })),
    total,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  // Clear cart
  delete carts[sessionId];

  res.json({ success: true, order });
});

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders
 *     responses:
 *       200:
 *         description: A list of the user's orders.
 *       401:
 *         description: Not authenticated.
 */
app.get('/api/orders', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userOrders = orders.filter(o => o.userId === req.session.userId);
  res.json(userOrders);
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The order details.
 *       403:
 *         description: Unauthorized.
 *       404:
 *         description: Order not found.
 */
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.userId !== req.session.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json(order);
});

// ============================================
// USER CRUD API ROUTES
// ============================================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (with passwords visible for demo purposes)
 *     responses:
 *       200:
 *         description: A list of all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', (req, res) => {
  // Return all users, including passwords since this is a demo
  res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: The user details (including password for demo purposes).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 */
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    // Return user with password since this is a demo
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields.
 */
app.post('/api/users', (req, res) => {
  const { email, password, name, address, controls } = req.body;

  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  // Generate new ID
  const newId = Math.max(...users.map(u => u.id), 0) + 1;

  const newUser = {
    id: newId,
    email,
    password,
    name,
    address: address || {}, // Default to empty object
    controls: controls || {} // Default to empty object
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 */
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { email, password, name, address, controls } = req.body;

  // Update only provided fields
  if (email !== undefined) users[userIndex].email = email;
  if (password !== undefined) users[userIndex].password = password;
  if (name !== undefined) users[userIndex].name = name;
  if (address !== undefined) users[userIndex].address = address;
  if (controls !== undefined) users[userIndex].controls = controls;

  res.json(users[userIndex]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID.
 *     responses:
 *       200:
 *         description: Deletion successful.
 *       404:
 *         description: User not found.
 */
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ success: true, user: deletedUser });
});

// ============================================
// HTML ROUTES
// ============================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'orders.html'));
});

app.get('/admin/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-products.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🛒 E-commerce demo app running on http://localhost:${PORT}`);
  console.log(`\n📝 Test credentials:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Password: password123\n`);
  console.log(`📄 API docs available at http://localhost:${PORT}/api-docs`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         image:
 *           type: string
 *         description:
 *           type: string
 *     NewProduct:
 *       type: object
 *       required: [name, price, category]
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         image:
 *           type: string
 *         stock:
 *           type: integer
 *     UpdateProduct:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         image:
 *           type: string
 *         stock:
 *           type: integer
 *     Checkout:
 *       type: object
 *       required: [shippingAddress, paymentMethod]
 *       properties:
 *         shippingAddress:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             zipCode:
 *               type: string
 *             phone:
 *               type: string
 *         paymentMethod:
 *           type: string
 *           enum: [credit-card, paypal, bank-transfer]
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         controls:
 *           $ref: '#/components/schemas/Controls'
 *     NewUser:
 *       type: object
 *       required: [email, password, name]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         controls:
 *           $ref: '#/components/schemas/Controls'
 *     UpdateUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         controls:
 *           $ref: '#/components/schemas/Controls'
 *     Address:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         zip:
 *           type: string
 *         country:
 *           type: string
 *     Controls:
 *       type: object
 *       properties:
 *         canCheckout:
 *           type: boolean
 */