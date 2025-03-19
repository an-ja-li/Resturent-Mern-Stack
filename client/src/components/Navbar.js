import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./Navbar.css"; // Import custom styles

const CustomNavbar = () => {
  return (
    <>
      {/* Import Google Font for cursive style */}
      <link
        href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
        rel="stylesheet"
      />

      <Navbar expand="lg" className="custom-navbar py-3">
        <Container>
          {/* Logo */}
          <Navbar.Brand href="#" className="navbar-brand">
            Food O'clock
          </Navbar.Brand>

          {/* Navbar Toggle for Mobile */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
            <Nav className="nav-links">
              <Nav.Link href="#" className="active-link">Home</Nav.Link>
              <Nav.Link href="#">Staff</Nav.Link>
              <Nav.Link href="#">Food & Drink</Nav.Link>
              <Nav.Link href="#">Order</Nav.Link>
              <Nav.Link href="#">Bills</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* Login Button */}
          <Button className="login-btn">Login</Button>
        </Container>
      </Navbar>
    </>
  );
};

export default CustomNavbar;
