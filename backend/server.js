const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
app.use(express.static(path.join(__dirname, '../html file')));
app.use("/image", express.static(path.join(__dirname, "../image")));
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
app.use(express.json());  
mongoose.connect(process.env.MONGO_URI )
    .then(() => console.log('MongoDB connected'))  
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, '../html file/signup.html'));
});
const User = mongoose.model('User', userSchema);
app.post("/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send("Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.send("User already exists");
  }

  const user = new User({ email, password });
  await user.save();

  app.get("/",  (req, res) => {
    res.sendFile(path.join(__dirname, '../html file/bolts.html'));
  });

  res.redirect("/login");
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../html file/login.html'));
});
app.get("/",  (req, res) => {
    res.sendFile(path.join(__dirname, '../html file/bolts.html'));
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
// Inside your app.post("/login", ...) 
if (user.password === password) {
    // We send a tiny piece of HTML/JS instead of a direct redirect
    // This forces the browser to save the user's email before moving to the home page
    return res.send(`
        <script>
            localStorage.setItem('currentUser', '${user.email}');
            alert('Login Successful! Welcome back.');
            window.location.href = '/'; 
        </script>
    `);
}
});

app.listen(process.env.PORT, () => {   
    console.log(`Server running on port ${process.env.PORT}`);
});