import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";

const App = () => {
  return <div className="flex max-w-6xl mx-auto">
    <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/sign-in" element={<LoginPage/>}/>
        <Route path="/sign-up" element={<SignupPage/>}/>
    </Routes>
  </div>;
};

export default App;
