const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES: 
// Serve files from 'html' but DISABLE automatic index.html serving
app.use(express.static(path.join(__dirname, '../html'), { index: false }));
// Serve other public assets if they exist
app.use(express.static(path.join(__dirname, '../')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'your_connection_string')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// 1. The Intro Page (ROOT)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// 2. The Main Page (Home)
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/index.html'));
});

// 3. Auth Routes
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, '../html/signup.html'));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../html/login.html'));
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.password === password) {
        return res.send(`
            <script>
                localStorage.setItem('currentUser', '${user.email}');
                alert('Login Successful!');
                window.location.href = '/home';
            </script>
        `);
    }
    res.send("Invalid credentials");
});

// Vercel handles the port, but local needs 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;