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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
