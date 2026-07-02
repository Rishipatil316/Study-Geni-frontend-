// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard";
import FilesList from "./components/File";
import Quiz from "./components/Quiz";
import Summary from "./components/Summary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}> {/* Layout wraps nested routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="studentdashboard" element={<StudentDashboard />} />
          <Route path="teacherdashboard" element={<TeacherDashboard />} />
          <Route path="admindashboard" element={<AdminDashboard />} />
          <Route path="files" element={<FilesList />} />
          <Route path="summary/:fileId" element={<Summary />} />
          <Route path="quiz/:fileId" element={<Quiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;