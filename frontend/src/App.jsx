import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import CreateTrip from "./pages/CreateTrip/CreateTrip";
import MyTrips from "./pages/MyTrips/MyTrips";
import ViewTrip from "./pages/ViewTrip/ViewTrip";
import Profile from "./pages/Profile/Profile";
import FloatingChat from "./components/FloatingChat/FloatingChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/trips/:id" element={<ViewTrip />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <FloatingChat />
    </BrowserRouter>
  );
}

export default App;