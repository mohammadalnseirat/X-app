import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import RigntPanel from "./components/common/RigntPanel";
import Sidebar from "./components/common/Sidebar";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    // we use query key to give a unique name to refer it to athor commponents later instead of call a function each time
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        // create a response:
        const res = await fetch("/api/v1/auth/me");
        // covert the data to json:
        const data = await res.json();
        if (data.success === false) {
          return null;
        }
        if (!res.ok) {
          throw new Error(data.message);
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
  // if there is loading show spinner:
  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <span className="loading loading-infinity w-28 h-28  text-sky-500"></span>
      </div>
    );
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        {/* Common component, bc it's not wrapped with Routes */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/sign-in"} />}
        />
        <Route
          path="/sign-in"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/sign-up"
          element={!authUser ? <SignupPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notifications"
          element={
            authUser ? <NotificationPage /> : <Navigate to={"/sign-in"} />
          }
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to={"/sign-in"} />}
        />
      </Routes>
      {authUser && <RigntPanel />}
      <Toaster />
    </div>
  );
};

export default App;
