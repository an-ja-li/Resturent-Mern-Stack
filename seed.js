require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
      console.error("❌ MongoDB Error:", err);
      process.exit(1);
  });

// Define Food Schema
const Food = mongoose.model("Food", new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
}));

// Sample Food Data with Image URLs
const sampleFoods = [
   
        { name: "Sandwich", price: 90, image: "/images/Sandwich.png" },
        { name: "Burger", price: 150, image: "/images/burger.png" },
        { name: "Pizza", price: 120, image: "/images/pizza.png" },
        { name: "Pasta", price: 110, image: "/images/pasta.png" },
        { name: "Spring Roll", price: 70, image: "/images/spring_roll.png" },
        { name: "Hakka Noodles", price: 200, image: "/images/Hakka_Noodles.png" },
        { name: "Pav Bhaji", price: 130, image: "/images/PavBhaji.png" },
        { name: "French Fries", price: 130, image: "/images/french_fries.png" },
        { name: "Pumpkin Soup", price: 90, image: "/images/Pumpkin_Soup.png" },
        { name: "Gulab Jamun", price: 130, image: "/images/Gulab_Jamun.png" },
        { name: "Ratatouille", price: 150, image: "/images/Ratatouille.png" },
        { name: "Rasgulla", price: 80, image: "/images/Rasgulla.png" },
        { name: "Shawarma", price: 120, image: "/images/Shawarma.png" },
        { name: "Dosa", price: 100, image: "/images/Dosa.png" },
        { name: "Croissant", price: 70, image: "/images/Croissant.png" },
        { name: "Samosa", price: 20, image: "/images/Samosa.png" },
        { name: "Jalebi", price: 50, image: "/images/Jalebi.png" },
        { name: "Gupchup", price: 40, image: "/images/Gupchup.png" },
        { name: "Manchurian", price: 100, image: "/images/Manchurian.png" },
        { name: "Chilli Potato", price: 80, image: "/images/ChilliPotato.png" },
        { name: "Bhel Puri", price: 50, image: "/images/BhelPuri.png" },
        { name: "Dabeli", price: 40, image: "/images/Dabeli.png" },
        { name: "Garlic Bread", price: 60, image: "/images/GarlicBread.png" },
        { name: "Idli", price: 30, image: "/images/idli.png" },
        { name: "Mozzarella Stick", price: 70, image: "/images/Mozzarella_stick.png" },
        { name: "Pancake", price: 90, image: "/images/Pancake.png" },
        { name: "Vada", price: 20, image: "/images/Vada.png" }
    ];
    

// Insert Data into MongoDB
const seedDatabase = async () => {
    try {
        await Food.deleteMany(); // Optional: Clears existing data
        await Food.insertMany(sampleFoods);
        console.log("✅ Sample food data added successfully!");
    } catch (err) {
        console.error("❌ Error inserting food data:", err);
    } finally {
        mongoose.connection.close(); // Close connection after insertion
    }
};

seedDatabase();
