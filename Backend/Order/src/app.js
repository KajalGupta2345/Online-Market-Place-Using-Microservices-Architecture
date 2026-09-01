const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const orderRoutes = require('../src/routes/order.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vendex-frontend.onrender.com'
  ],
  credentials: true
}));

app.use('/api/orders',orderRoutes);

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"order service is running..."
    });
});



module.exports = app;