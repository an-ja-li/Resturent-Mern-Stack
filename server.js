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
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true } // Stores image path
});
const Food = mongoose.model("Food", FoodSchema);

// Routes
app.get("/", (req, res) => res.send("🚀 Server is running..."));

// ✅ Fetch all food items
app.get("/api/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: "Error fetching foods", error: err });
    }
});

// ✅ Add a new food item
app.post("/api/foods", async (req, res) => {
    try {
        const { name, price, image } = req.body;
        const newFood = new Food({ name, price, image });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: "Error adding food item", error: err });
    }
});

// ✅ Update a food item
app.put("/api/foods/:id", async (req, res) => {
    try {
        const { name, price, image } = req.body;
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, { name, price, image }, { new: true });
        if (!updatedFood) return res.status(404).json({ message: "Food item not found" });
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: "Error updating food item", error: err });
    }
});

// ✅ Delete a food item
app.delete("/api/foods/:id", async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) return res.status(404).json({ message: "Food item not found" });
        res.json({ message: "Food item deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting food item", error: err });
    }
});

app.get("/api/foods/:id", async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);
      if (!food) {
        return res.status(404).json({ message: "Food item not found" });
      }
      res.json(food);
    } catch (error) {
      console.error("Error fetching food:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
