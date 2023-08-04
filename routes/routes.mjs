import express from "express";
import User from "../models/user.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const router = express.Router();

//registriert User und speichert den User in der DB mit gehashtem Passwort
router.post('/register', async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  const emailExists = await User.findOne({email: req.body.email});
  if (emailExists) {
    return res.status(400).send({
      message: 'Email already exists'
    });
  }else {
    const result= await user.save();
    const {password, ...data} = await result.toJSON();
    res.send(data);
  }
});

//login mit email und passwort
router.post('/login', async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    return res.status(404).send({
      message: 'User not found'
    });
  }
  if (!await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).send({
      message: 'Invalid credentials'
    });
  }
  //secret in .env file speichern
  const token = jwt.sign({_id: user._id}, 'secret');
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  })
  res.send({
    message: 'success'
  });
});

//user auslesen, falls cookie vorhanden ist erfolgt message nicht authenticated
router.get('/user', async (req, res) => {
  try {
    const cookie = req.cookies['jwt'];

  const claims = jwt.verify(cookie, 'secret');
  if (!claims) {
    return res.status(401).send({
      message: 'Not authenticated'
    });
  }
  const user = await User.findOne({_id: claims._id});
  const {password, ...data} = await user.toJSON();
  res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: 'Not authenticated'
    });
  }
});

// cookie auf 0 setzen, um auszuloggen
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {maxAge: 0});
  res.send({
    message: 'successfully logout'
  });
});


export default router;