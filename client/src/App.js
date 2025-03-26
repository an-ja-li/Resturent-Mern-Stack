import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Staff from "./pages/Staff";
import FoodMenu from "./pages/FoodMenu";
import AddFood from "./pages/AddFood"; // ✅ Imported AddFood component
import EditFood from "./pages/EditFood";
import Order from "./pages/Order";
import Bills from "./pages/Bills";

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/food-menu" element={<FoodMenu />} />
        <Route path="/add-food" element={<AddFood />} /> {/* ✅ Added AddFood route */}
        <Route path="/edit-food/:id" element={<EditFood />} />
        <Route path="/order" element={<Order />} />
        <Route path="/bills" element={<Bills />} />
      </Routes>
    </Router>
  );
}

export default App;
