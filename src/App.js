import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Courses from "./pages/home/courses/courses";
import Private from "./auth/Routes/private";
import UserPage from "./pages/home/users/userpage";
import SignIn from "./auth/LogIn/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
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
