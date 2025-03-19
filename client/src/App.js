import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./components/Navbar";  // Import with new name

function App() {
  return (
    <div className="App">
      <CustomNavbar /> {/* Use new component name */}
    </div>
  );
}

export default App;
