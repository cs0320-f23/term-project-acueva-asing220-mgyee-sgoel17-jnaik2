"use client";

import React from "react";
import HowTo from "./how-to/page";

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