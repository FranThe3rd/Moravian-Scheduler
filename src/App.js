import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Courses from "./pages/home/courses/courses";
import Private from "./auth/Routes/private";
import Login from "./auth/login/login";
import UserPage from "./pages/home/users/userpage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserPage />} />

        {/* Protected pages */}
        <Route
          path="/courses"
          element={
            <Private>
              <Courses />
            </Private>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
