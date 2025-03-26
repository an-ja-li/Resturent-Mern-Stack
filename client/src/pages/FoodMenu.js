import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form, Spinner, Alert } from "react-bootstrap";
import "./FoodMenu.css";

const FoodMenu = () => {
  const [menu, setMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Starter",
    price: "",
    image: "",
    isVeg: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Starter", "Main Course", "Dessert", "Beverages"];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menu");
      setMenu(response.data);
    } catch (err) {
      setError("Failed to fetch menu. Please try again.");
    }
  };

  const handleShowModal = (foodItem = null) => {
    setEditingFood(foodItem);
    setFormData(
      foodItem || { name: "", category: "Starter", price: "", image: "", isVeg: true }
    );
    setImagePreview(foodItem?.image || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImagePreview(null);
    setImageFile(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleVegStatus = (e) => {
    setFormData({ ...formData, isVeg: e.target.value === "Veg" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;

    const formDataImg = new FormData();
    formDataImg.append("image", imageFile);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formDataImg, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl;
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const uploadedImageUrl = await uploadImage();
    if (uploadedImageUrl === null) {
      setLoading(false);
      return;
    }

    const updatedData = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      image: uploadedImageUrl || formData.image,
      isVeg: formData.isVeg,
    };

    try {
      if (editingFood) {
        await axios.put(`http://localhost:5000/api/menu/${editingFood._id}`, updatedData);
      } else {
        await axios.post("http://localhost:5000/api/menu", updatedData);
      }
      fetchMenu();
      handleCloseModal();
    } catch (err) {
      setError("Error saving food item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/${id}`);
        fetchMenu();
      } catch (err) {
        setError("Error deleting food item. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="primary" onClick={() => handleShowModal()}>Add New Food Item</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((food) => (
            <tr key={food._id}>
              <td><img src={food.image} alt={food.name} className="food-image" /></td>
              <td>{food.name}</td>
              <td>{food.category}</td>
              <td>${food.price}</td>
              <td className={food.isVeg ? "text-success" : "text-danger"}>
                {food.isVeg ? "Veg 🌱" : "Non-Veg 🍗"}
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(food)}>Edit</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(food._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingFood ? "Edit Food Item" : "Add New Food Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="isVeg" value={formData.isVeg ? "Veg" : "Non-Veg"} onChange={handleToggleVegStatus} required>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image mt-2" />}
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FoodMenu;
