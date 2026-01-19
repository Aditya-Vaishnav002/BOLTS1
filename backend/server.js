const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, '../html')));

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve CSS, JS, and Images from the 'html' folder
// { index: false } prevents the browser from auto-loading html/index.html as the homepage
app.use(express.static(path.join(__dirname, '../html'), { index: false }));
app.use(express.static(path.join(__dirname, '../'))); // Access to root assets

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// --- USER SCHEMA ---
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// 1. THE INTRO PAGE (Root URL: /)
// This serves the index.html located in your main BOLTS1 folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..html/index.html'));
});
// 2. THE MAIN PAGE (Route: /home)
// This serves the index.html located inside the html/ folder
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/home.html'));
});

// 3. AUTH ROUTES
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

// --- VERCEL EXPORT ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;