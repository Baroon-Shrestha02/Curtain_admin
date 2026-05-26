import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Gallery from "./Pages/Gallery";
import Wrapper from "./Components/Layout/Wrapper";
import Login from "./Components/Auth/Login";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected — everything inside renders in Wrapper's <Outlet /> */}
      <Route
        element={
          <ProtectedRoute requireAdmin>
            <Wrapper />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gallery" element={<Gallery />} />
      </Route>

      {/* Unknown routes -> login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
