const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const upload = require('./s3Config'); // Import the file you made in the last step
const ObjectModel = require('./models/ObjectModel');
const User = require('./models/User');

const app = express();
app.use(express.json());

// CORS Configuration - Single, unified setup
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "https://visualize-3-d-objects-b7nb.vercel.app", // No trailing slash
        process.env.FRONTEND_URL
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/api/objects/user/:userId', async (req, res) => {
    try {
        const objects = await ObjectModel.find({ userId: req.params.userId });
        res.json(objects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/objects/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // This comes from your JWT (we'll implement the middleware later)
        // For testing in Postman, we can manually pass a userId in the body
        const { userId } = req.body;

        const newObject = new ObjectModel({
            userId: userId,
            fileName: req.file.originalname,
            s3Url: req.file.location // This is the public URL from S3
        });

        await newObject.save();

        res.status(201).json({
            message: "3D Object uploaded to S3 and saved to DB",
            data: newObject
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// --- ROUTES ---

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User does not exist" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000; // Use process.env.PORT
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});;