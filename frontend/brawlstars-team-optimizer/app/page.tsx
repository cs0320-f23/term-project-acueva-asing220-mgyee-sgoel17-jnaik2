"use client";
import React from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import { BrowserRouter as Router } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./how-to/page";
import About from "./about/page";
import TeamOpt2v2 from "./2v2-optimizer/page";
import TeamOpt3v3 from "./3v3-optimizer/page";
import Signup from "./sign-up/page";
import Login from "./log-in/page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/how-to" element={<Home />} />
        <Route path="/3v3-optimizer" element={<TeamOpt3v3 />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
export default App;
