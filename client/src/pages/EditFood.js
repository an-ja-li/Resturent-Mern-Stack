import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditFood = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [food, setFood] = useState({ name: "", price: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/foods/${id}`)
      .then((response) => {
        console.log("Fetched Food:", response.data);
        setFood(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching food details:", err);
        setError("Failed to fetch food details.");
        setLoading(false);
      });
  }, [id]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/foods/${id}`, food);
      navigate("/food-menu"); // Redirect after successful edit
    } catch (err) {
      console.error("Error updating food:", err);
      setError("Failed to update food item.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Edit Food Item</h2>

      {loading ? (
        <div className="text-center"><h4>Loading...</h4></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Food Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={food.name} 
              onChange={(e) => setFood({ ...food, name: e.target.value })} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input 
              type="number" 
              className="form-control" 
              value={food.price} 
              onChange={(e) => setFood({ ...food, price: e.target.value })} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary">Update Food</button>
        </form>
      )}
    </div>
  );
};

export default EditFood;
