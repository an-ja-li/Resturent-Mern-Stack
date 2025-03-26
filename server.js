const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit"); // Prevent API abuse

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins (can be restricted)
app.use("/images", express.static("public/images"));

// ✅ Rate Limiting (Prevent Excessive Requests)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
});
app.use(apiLimiter);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Configure Multer for Image Upload
const storage = multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// ✅ Food Schema
const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true } // Ensure image is provided
});
const Food = mongoose.model("Food", FoodSchema);

// ✅ Staff Schema
const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    age: { type: Number, required: true, min: 18, max: 60 },
    salary: { type: Number, required: true, min: 4000 },
    paymentStatus: { type: String, enum: ["Paid", "Non-Paid"], required: true }
});
const Staff = mongoose.model("Staff", StaffSchema);

// ✅ Root Route
app.get("/", (req, res) => res.send("🚀 Server is running..."));

// ✅ Image Upload Route
app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({ imageUrl: `/images/${req.file.filename}` });
});

// ✅ Fetch all food items
app.get("/api/foods", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: "Error fetching foods", error: err.message });
    }
});

// ✅ Add a new food item
app.post("/api/foods", async (req, res) => {
    try {
        const { name, price, image } = req.body;
        if (!image) return res.status(400).json({ message: "Image is required" });

        const newFood = new Food({ name, price, image });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: "Error adding food item", error: err.message });
    }
});

// ✅ Fetch all staff members
app.get("/api/staff", async (req, res) => {
    try {
        const staff = await Staff.find();
        res.json(staff);
    } catch (err) {
        res.status(500).json({ message: "Error fetching staff", error: err.message });
    }
});

// ✅ Add a new staff member
app.post("/api/staff", async (req, res) => {
    try {
        const { name, role, age, salary, paymentStatus } = req.body;

        if (!name || !role || !age || !salary || !paymentStatus) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newStaff = new Staff({ name, role, age, salary, paymentStatus });
        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (err) {
        res.status(400).json({ message: "Error adding staff", error: err.message });
    }
});

// ✅ Update a staff member
app.put("/api/staff/:id", async (req, res) => {
    try {
        const { name, role, age, salary, paymentStatus } = req.body;
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            { name, role, age, salary, paymentStatus },
            { new: true }
        );

        if (!updatedStaff) return res.status(404).json({ message: "Staff not found" });

        res.json(updatedStaff);
    } catch (err) {
        res.status(400).json({ message: "Error updating staff", error: err.message });
    }
});

// ✅ Delete a staff member
app.delete("/api/staff/:id", async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) return res.status(404).json({ message: "Staff not found" });

        res.json({ message: "Staff deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting staff", error: err.message });
    }
});

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
