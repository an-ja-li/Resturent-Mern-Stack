import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState({ name: "", price: "", image: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/foods/${id}`)
      .then((response) => {
        console.log("Fetched Food:", response.data);
        setFood(response.data);

        // Ensure the correct image URL is set for preview
        if (response.data.image) {
          setImagePreview(response.data.image.startsWith("http") ? response.data.image : `${BASE_URL}${response.data.image}`);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching food details:", err);
        setError("Failed to fetch food details.");
        setLoading(false);
      });

    // Cleanup function to revoke object URLs when unmounting
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [id]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Release the old object URL if exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // Show local preview before upload
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Update state with the new image URL from the server
      const uploadedImageUrl = response.data.imageUrl;
      setFood({ ...food, image: uploadedImageUrl });
      setImagePreview(uploadedImageUrl.startsWith("http") ? uploadedImageUrl : `${BASE_URL}${uploadedImageUrl}`);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/api/foods/${id}`, food);
      navigate("/food-menu");
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

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input 
              type="file" 
              className="form-control" 
              onChange={handleImageChange} 
            />
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Food Preview" 
                className="mt-2" 
                style={{ width: "150px", height: "auto", borderRadius: "8px" }} 
              />
            )}
          </div>

          <button type="submit" className="btn btn-primary">Update Food</button>
        </form>
      )}
    </div>
  );
};

export default EditFood;
