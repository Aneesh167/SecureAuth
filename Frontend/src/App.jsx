import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Navbar from "./Components/Navbar.jsx";

const App = () => {
  return (
    <BrowserRouter>
      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-[#2C2B2A] via-[#5A5856] to-[#2C2B2A]">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-4 py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
