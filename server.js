const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Import the path module

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Dog model
const DogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  images: [{ type: String, required: true }], // Store image URLs
});

const Dog = mongoose.model('Dog', DogSchema);

// Multer configuration for image uploads
const upload = multer({ dest: 'uploads/' });

// Routes


// Dog posting route with image uploads
app.post('/api/dogs', upload.array('images', 3), async (req, res) => {
  const { name, description, phone, address } = req.body;
  
  const images = req.files.map(file => file.path); // Extract uploaded image URLs
  const dog = new Dog({ name, description, phone, address, images });
  await dog.save();
  res.status(201).send('Dog posted');
});

app.get('/api/dogs', async (req, res) => {
    try {
      // Retrieve the list of dogs from the database
      const dogs = await Dog.find().populate('name' , 'images');
  
      // Send the list of dogs as a response
      res.json(dogs);
    } catch (error) {
      // If an error occurs during retrieval, send an error response
      console.error('Error is ' , error)}})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
