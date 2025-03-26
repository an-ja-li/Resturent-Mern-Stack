const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "public/images");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/images", express.static(uploadDir));

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});
app.use(apiLimiter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Configure Multer for Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Food Schema
const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    isVeg: { type: Boolean, required: true }
});
const Food = mongoose.model("Food", FoodSchema);

// Image Upload Route
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    console.log("Uploaded file:", req.file);
    res.json({ imageUrl });
});

// Fetch all food items
app.get("/api/menu", async (req, res) => {
    try {
        const menu = await Food.find();
        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: "Error fetching menu", error: err.message });
    }
});

// Add a new food item
app.post("/api/menu", async (req, res) => {
    try {
        console.log("Received Food Data:", req.body); // Debugging log

        const { name, category, price, image, isVeg } = req.body;
        if (!name || !category || !price || !image || typeof isVeg === 'undefined') {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newFood = new Food({ name, category, price, image, isVeg });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        console.error("Error adding food item:", err);
        res.status(400).json({ message: "Error adding food item", error: err.message });
    }
});

// Update a food item
app.put("/api/menu/:id", async (req, res) => {
    try {
        const { name, category, price, image, isVeg } = req.body;
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            { name, category, price, image, isVeg },
            { new: true }
        );
        if (!updatedFood) return res.status(404).json({ message: "Food item not found" });
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: "Error updating food item", error: err.message });
    }
});

// Delete a food item
app.delete("/api/menu/:id", async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) return res.status(404).json({ message: "Food item not found" });
        res.json({ message: "Food item deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting food item", error: err.message });
    }
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
