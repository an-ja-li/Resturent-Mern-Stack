const express = require("express");
 

const app = express();

// Middleware
app.use(express.json()); // Allow JSON request bodies


// Sample API Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 