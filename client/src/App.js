import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./components/Navbar";  // Import with new name
import Homepage from "./pages/Homepage";

function App() {
  return (
    <div className="App">
      <CustomNavbar /> {/* Use new component name */}
      <Homepage />
    </div>
  );
}

export default App;
