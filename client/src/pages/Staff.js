import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import "./StaffPage.css"; // Import CSS file for custom styling
import Switch from "react-switch"; // Import React Switch for toggling

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: "", role: "Manager", age: "", salary: 8000, paymentStatus: "Paid" });

  const roles = {
    "Manager": 30000,
    "Chef": 15000,
    "Waiter": 6000,
    "Cleaner": 4000
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/staff");
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  const handleShowModal = (staffMember = null) => {
    setEditingStaff(staffMember);
    setFormData(staffMember || { name: "", role: "Manager", age: "", salary: 8000, paymentStatus: "Paid" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData({ ...formData, role: value, salary: roles[value], paymentStatus: roles[value] >= 5000 ? "Paid" : "Non-Paid" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const togglePaymentStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "Paid" ? "Non-Paid" : "Paid";
      await axios.put(`http://localhost:5000/api/staff/${id}`, { paymentStatus: updatedStatus });
      fetchStaff();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.age < 18 || formData.age > 60) {
      alert("Age must be between 18 and 60.");
      return;
    }
    if (staff.length >= 4 && !editingStaff) {
      alert("Only 4 staff members are allowed.");
      return;
    }
    try {
      if (editingStaff) {
        await axios.put(`http://localhost:5000/api/staff/${editingStaff._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/staff", formData);
      }
      fetchStaff();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving staff:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(`http://localhost:5000/api/staff/${id}`);
        fetchStaff();
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={() => handleShowModal()} disabled={staff.length >= 4}>
        Add New Staff
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Age</th>
            <th>Salary</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td>{member.age}</td>
              <td>${member.salary}</td>
              
              <td className="toggle-container">
              <div className="toggle-switch">
                <label
                  className={`toggle-label ${member.paymentStatus === "Paid" ? "active" : ""}`}
                  onClick={() => togglePaymentStatus(member._id, member.paymentStatus)}
                >
                  Paid
                </label>
                <label
                  className={`toggle-label ${member.paymentStatus === "Non-Paid" ? "active" : ""}`}
                  onClick={() => togglePaymentStatus(member._id, member.paymentStatus)}
                >
                  Unpaid
                </label>
              </div>
            </td>


              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(member)}>Edit</Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(member._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingStaff ? "Edit Staff" : "Add New Staff"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange} required>
                {Object.keys(roles).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Salary</Form.Label>
              <Form.Control type="number" name="salary" value={formData.salary} readOnly />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StaffPage;