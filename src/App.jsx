import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { EventDetails } from "./components/EventDetails";
import { MyTickets } from "./pages/MyTickets";
import { CreateEvent } from "./pages/CreateEvent";
import { Dashboard } from "./pages/Dashboard";
import { EditEvent } from "./pages/EditEvent";
import { CouponManager } from "./pages/CouponManager";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./context/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { Footer } from "./components/Footer";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000, // Todos os toasts ficarão visíveis por 4 segundos
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route
              path="/create-event"
              element={
                <PrivateRoute>
                  <CreateEvent />
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path="/edit-event/:id"
              element={
                <PrivateRoute>
                  <EditEvent />
                </PrivateRoute>
              }
            />
            <Route
              path="/coupons-manager"
              element={
                <PrivateRoute>
                  <CouponManager />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
