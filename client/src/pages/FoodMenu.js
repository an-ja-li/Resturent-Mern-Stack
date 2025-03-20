import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FoodMenu.css";

const FoodMenu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch food items from the backend
    axios.get("http://localhost:5000/api/foods")
      .then((response) => {
        setFoods(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching food data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4"></h2>

      {/* Show loading message while fetching data */}
      {loading ? (
        <div className="text-center">
          <h4>Loading...</h4>
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center">
          <h4>No food items available</h4>
        </div>
      ) : (
        <div className="row">
          {foods.map((food) => (
            <div key={food._id} className="col-md-3 mb-4">
              <div className="card shadow-sm">
                <img 
                  src={`http://localhost:5000${food.image}`}  // ✅ Fixed Image Path
                  className="card-img-top" 
                  alt={food.name} 
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/images/placeholder.png")} // ✅ Fallback Image
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{food.name}</h5>
                  <p className="fw-bold text-success">₹{food.price.toFixed(2)}</p>
                  <button className="btn ">✏ Edit</button>
                  <button className="btn ">🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodMenu;
