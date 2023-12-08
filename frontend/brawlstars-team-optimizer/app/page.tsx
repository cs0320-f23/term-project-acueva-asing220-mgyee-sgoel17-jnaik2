"use client";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import HowTo from "./how-to/page";
import About from "./about/page";
import TeamOpt2v2 from "./2v2-optimizer/page";
import TeamOpt3v3 from "./3v3-optimizer/page";

// Remove routing
function App() {
  return (
    <HowTo></HowTo>
  );
}

    // <Router>
    //   <div>
    //     <Routes>
    //       <Route path="/" element={<HowTo />} />
    //       <Route path="/how-to" element={<HowTo />} />
    //       <Route path="/3v3-optimizer" element={<TeamOpt3v3 />} />
    //       <Route path="/2v2-optimizer" element={<TeamOpt2v2 />} />
    //       <Route path="/about" element={<About />} />
    //     </Routes>
    //   </div>
    // </Router>

export default App;
