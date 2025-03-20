const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/images", express.static("public/images")); // Serve images from /public/images

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Food Schema
const FoodSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String, // Stores image path
});
const Food = mongoose.model("Food", FoodSchema);

// Routes
app.get("/", (req, res) => res.send("Server is running..."));

app.get("/api/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: "Error fetching foods", error: err });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
