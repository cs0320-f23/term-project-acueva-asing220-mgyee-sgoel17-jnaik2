"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "@/components/NavBar";
import HowTo from "./how-to/page";
// import HowTo from "@/pages/how-to";
// import TeamOpt3v3 from "@/pages/3v3-optimizer";
// import TeamOpt2v2 from "@/pages/2v2-optimizer";
// import About from "@/pages/About";

export default function Home() {
  return (
    <div>
      <HowTo></HowTo>
    </div>
  );
}

// <Router>
    //   <div>
    //     <Routes>
    //       <Route path="" element={<HowTo />} />
    //       <Route path="/how-to" element={<HowTo />} />
    //       <Route path="/3v3-optimizer" element={<TeamOpt3v3 />} />
    //       <Route path="/2v2-optimizer" element={<TeamOpt2v2 />} />
    //       <Route path="/about" element={<About />} />
    //     </Routes>
    //   </div>
    // </Router>