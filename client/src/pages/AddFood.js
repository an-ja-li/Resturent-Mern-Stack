import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddFood = () => {
  const navigate = useNavigate();
  const [food, setFood] = useState({ name: "", price: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show a preview before upload
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Store the uploaded image URL from the server response
      setFood({ ...food, image: response.data.imageUrl });
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/foods", food);
      navigate("/food-menu");
    } catch (err) {
      console.error("Error adding food:", err);
      setError("Failed to add food item.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Add New Food Item</h2>

      {error && <div className="alert alert-danger">{error}</div>}

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

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input 
            type="file" 
            className="form-control" 
            onChange={handleImageChange} 
            required
          />
          {imagePreview && (
            <img src={imagePreview} alt="Food Preview" className="mt-2" style={{ width: "150px", height: "auto" }} />
          )}
        </div>

        <button type="submit" className="btn btn-success">Add Food</button>
      </form>
    </div>
  );
};

export default AddFood;
