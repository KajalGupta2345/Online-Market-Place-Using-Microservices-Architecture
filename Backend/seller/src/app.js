const cookieParser = require('cookie-parser');
const express = require('express');
const sellerRoutes = require('./routes/seller.routes');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://<tumhara-deployed-frontend-domain-agar-hai>'
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/seller',sellerRoutes);

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"seller dashboard service is running..."
    });
});


module.exports = app;