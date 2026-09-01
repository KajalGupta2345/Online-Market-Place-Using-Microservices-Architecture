const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const paymentRoutes = require('../src/routes/payment.routes');

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://vendex-frontend.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/payment',paymentRoutes);
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"payment service is running..."
    });
});


module.exports = app;