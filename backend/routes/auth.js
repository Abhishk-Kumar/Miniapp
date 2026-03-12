const express=require('express');


const router=express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
require('dotenv').config();

// POST route for /api/auth/login

router.post('/login', async(req, res)=>{
    const {username, password}=req.body;

    if(!username, !password){
        res.status(400).json({
            message:"username and password required"
        });
    }
    try{
        const result=await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )
   
    if(result.rows.length === 0){
        return res.status(400).json({message:"Wrong username or pass"})
    }

    const user=result.rows[0];
    const match=await bcrypt.compare(password, user.password_hash);

    if(!match){
        return res.status(401).json({message:"Wrong username or pass"})
    }

    const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
  
      res.json({ token });

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }
 
});

// GET route for /api/auth/translations/:lang
router.get('/translations/:lang', async (req, res) => {
    const { lang } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT key, value FROM translations WHERE lang_code = $1',
        [lang]
      );
  
      const translations = {};
      result.rows.forEach(row => {
        translations[row.key] = row.value;
      });
  
      res.json(translations);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  module.exports=router;