const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// In-memory storage (replace with a database in production)
let products = [
    {
        id: 1,
        name: "Ultra Boost Running Shoes",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800",
        category: "shoes",
        description: "Premium performance running shoes with responsive cushioning and breathable mesh upper. Perfect for both athletic performance and street style."
    },
    {
        id: 2,
        name: "Modern Slim-Fit Blazer",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800",
        category: "clothes",
        description: "Sophisticated blazer crafted from premium Italian fabric. Features a modern slim fit and subtle pattern. Perfect for both formal and smart-casual occasions."
    },
    {
        id: 3,
        name: "Premium Leather Backpack",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800",
        category: "accessories",
        description: "Handcrafted from full-grain leather with antique brass hardware. Features laptop compartment and multiple organizer pockets."
    },
    {
        id: 4,
        name: "Smart Chronograph Watch",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
        category: "accessories",
        description: "Luxury chronograph watch with sapphire crystal and automatic movement. Water-resistant up to 100m."
    },
    {
        id: 5,
        name: "Designer Sunglasses",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
        category: "accessories",
        description: "Premium acetate frame sunglasses with polarized lenses. Offers 100% UV protection with style."
    },
    {
        id: 6,
        name: "Minimalist Sneakers",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800",
        category: "shoes",
        description: "Clean, minimalist design sneakers made from premium leather. Features comfortable cushioning and versatile style."
    },
    {
        id: 7,
        name: "Wool Overcoat",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800",
        category: "clothes",
        description: "Luxurious wool-blend overcoat with classic design. Perfect for cold weather with style."
    },
    {
        id: 8,
        name: "Leather Messenger Bag",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        category: "accessories",
        description: "Professional messenger bag with padded laptop compartment and organized storage. Made from premium leather."
    },
    {
        id: 9,
        name: "Premium Denim Jacket",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800",
        category: "clothes",
        description: "Classic denim jacket with modern fit. Made from premium Japanese denim with subtle distressing."
    },
    {
        id: 10,
        name: "Athletic Performance Shoes",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        category: "shoes",
        description: "High-performance athletic shoes with innovative cushioning technology. Perfect for training and sports."
    },
    {
        id: 11,
        name: "Smart Casual Shirt",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
        category: "clothes",
        description: "Versatile button-down shirt made from premium cotton. Features modern fit and subtle pattern."
    },
    {
        id: 12,
        name: "Luxury Wallet",
        price: 119.99,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
        category: "accessories",
        description: "Slim bifold wallet crafted from genuine leather. Features RFID protection and multiple card slots."
    },
    {
        id: 13,
        name: "Designer Belt",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1553704458-f5c0e959cf06?w=800",
        category: "accessories",
        description: "Premium leather belt with designer buckle. Perfect complement to any formal or casual outfit."
    },
    {
        id: 14,
        name: "Casual Loafers",
        price: 139.99,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800",
        category: "shoes",
        description: "Comfortable loafers made from soft suede. Perfect for both casual and business casual settings."
    },
    {
        id: 15,
        name: "Bomber Jacket",
        price: 169.99,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
        category: "clothes",
        description: "Modern bomber jacket with premium hardware. Features comfortable fit and multiple pockets."
    }
];

let cart = [];

// In-memory user storage (in a real app, this would be a database)
let users = [];

// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

// Get cart
app.get('/api/cart', (req, res) => {
    res.json(cart);
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const { productId } = req.body;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ 
            success: false, 
            error: 'Product not found' 
        });
    }
    
    cart.push({
        ...product,
        cartId: Date.now() // Unique ID for cart item
    });
    
    res.json({ 
        success: true, 
        cart: cart 
    });
});

// Remove from cart
app.delete('/api/cart/:cartId', (req, res) => {
    const cartId = parseInt(req.params.cartId);
    const index = cart.findIndex(item => item.cartId === cartId);
    
    if (index === -1) {
        return res.status(404).json({ 
            success: false, 
            error: 'Cart item not found' 
        });
    }
    
    cart.splice(index, 1);
    res.json({ 
        success: true, 
        cart: cart 
    });
});

// Clear cart
app.delete('/api/cart', (req, res) => {
    cart = [];
    res.json({ 
        success: true, 
        cart: cart 
    });
});

// Authentication endpoints
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({
            success: false,
            message: 'Email already registered'
        });
    }
    
    // Create new user
    const user = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password, // In a real app, this should be hashed
        createdAt: new Date(),
        cart: []
    };
    
    users.push(user);
    console.log('New user created:', user.email);
    
    res.json({
        success: true,
        message: 'Account created successfully'
    });
});

app.post('/api/auth/signin', (req, res) => {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    
    // Check if user exists and password matches
    if (!user || user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
    
    // Send response without sensitive data
    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        },
        token: 'mock-jwt-token'
    });
});

// Serve signin.html for /signin route
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.html'));
});

// Serve signup.html for /signup route
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Get user profile
app.get('/api/user/profile', (req, res) => {
    const userId = parseInt(req.query.userId);
    const user = users.find(u => u.id === userId);
    
    if (user) {
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt
            }
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- GET  /api/products     : Get all products');
    console.log('- GET  /api/products/:id : Get product by ID');
    console.log('- GET  /api/cart         : Get cart contents');
    console.log('- POST /api/cart         : Add item to cart');
    console.log('- DEL  /api/cart/:cartId : Remove item from cart');
    console.log('- DEL  /api/cart         : Clear cart');
    console.log('- POST /api/auth/signup  : Sign up');
    console.log('- POST /api/auth/signin  : Sign in');
    console.log('- GET  /signin           : Sign in page');
    console.log('- GET  /signup           : Sign up page');
    console.log('- GET  /api/user/profile : Get user profile');
});
