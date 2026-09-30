import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import LayOut from "./LayOut";

import Login from "./page/Login";
import Register from "./page/Register";
import Home from "./page/Home";
import CreateTask from "./page/CreateTask";
import EditTask from "./page/EditTask";
import Profile from "./page/Profile";
import ForgotPassword from "./page/ForgotPassword";
import ResetPassword from "./page/ResetPassword";
import VerifyEmail from "./page/VerifyEmail";



import ProtectedRoute from "./components/ProtectedRoute";

import { logout } from "./utils/userSlice";

function App() {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp * 1000 <= Date.now()) {
        dispatch(logout());
      }
    } catch {
      dispatch(logout());
    }
  }, [token, dispatch]);

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <LayOut />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/tasks/:id" element={<EditTask />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />
      <Route
        path="/verify-email/:token"
        element={<VerifyEmail />}
      />
      
    </Routes>
  );
}

export default App;

