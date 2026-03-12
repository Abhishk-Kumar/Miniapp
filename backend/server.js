const express=require('express');
const cors=require('cors')
require('dotenv').config();

const app=express();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


app.get('/api/check', (req,res)=>{
    res.json({
        status:'api is working properly'
    });
});

const PORT=process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Backend running on http://localhost:${PORT}`);
});