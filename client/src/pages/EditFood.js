const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Adjust as needed
app.use("/images", express.static("public/images")); // Serve images from public folder

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Food Schema & Model
const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }, // Stores image path
});
const Food = mongoose.model("Food", FoodSchema);

// ✅ ROUTES

// 🏠 Home Route
app.get("/", (req, res) => res.send("✅ Server is running..."));

// 📌 GET: Fetch all food items
app.get("/api/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: "❌ Error fetching foods", error: err });
    }
});

// 📌 GET: Fetch a single food item by ID
app.get("/api/foods/:id", async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: "❌ Food item not found" });
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: "❌ Error fetching food", error: err });
    }
});

// ➕ POST: Add a new food item with image upload
app.post("/api/foods", upload.single("image"), async (req, res) => {
    try {
        const { name, price } = req.body;
        const imagePath = req.file ? `/images/${req.file.filename}` : null;

        if (!name || !price || !imagePath) {
            return res.status(400).json({ message: "❌ All fields are required" });
        }

        const newFood = new Food({ name, price, image: imagePath });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(500).json({ message: "❌ Error adding food", error: err });
    }
});

// ✏️ PUT: Update food item
app.put("/api/foods/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, price } = req.body;
        const imagePath = req.file ? `/images/${req.file.filename}` : req.body.image; // Keep old image if no new one

        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            { name, price, image: imagePath },
            { new: true }
        );
        if (!updatedFood) return res.status(404).json({ message: "❌ Food item not found" });
        res.json(updatedFood);
    } catch (err) {
        res.status(500).json({ message: "❌ Error updating food", error: err });
    }
});

// 🗑 DELETE: Remove food item
app.delete("/api/foods/:id", async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) {
            return res.status(404).json({ message: "❌ Food item not found" });
        }
        res.json({ message: "✅ Food item deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: "❌ Error deleting food", error: err });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
