const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const { evaluateBooleanControl } = require('./rules');

const app = express();
const PORT = 3000;

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

// Load data
let products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

// In-memory storage for carts and orders
const carts = {};
const orders = [];

// ============================================
// API ROUTES
// ============================================

// GET /api/products - Get all products with optional filters
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

// GET /api/products/:id - Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// GET /api/categories - Get all categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// POST /api/products - Create new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  // Basic validation
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
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

// PUT /api/products/:id - Update product
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

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json({ success: true, product: deletedProduct });
});

// POST /api/auth/login - Login user
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

// POST /api/auth/logout - Logout user
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// GET /api/auth/me - Get current user
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

// GET /api/cart - Get cart
app.get('/api/cart', (req, res) => {
  const sessionId = req.session.id;
  const cart = carts[sessionId] || [];
  res.json(cart);
});

// POST /api/cart - Add item to cart
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

// PUT /api/cart/:productId - Update cart item quantity
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

// DELETE /api/cart/:productId - Remove item from cart
app.delete('/api/cart/:productId', (req, res) => {
  const sessionId = req.session.id;
  const productId = parseInt(req.params.productId);

  if (!carts[sessionId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  carts[sessionId] = carts[sessionId].filter(item => item.productId !== productId);
  res.json({ success: true, cart: carts[sessionId] });
});

// POST /api/checkout - Process checkout
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

// GET /api/orders - Get user's orders
app.get('/api/orders', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userOrders = orders.filter(o => o.userId === req.session.userId);
  res.json(userOrders);
});

// GET /api/orders/:id - Get single order
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
});
