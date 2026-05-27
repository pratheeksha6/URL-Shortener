import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import UsersPage from "./pages/UsersPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default App;
