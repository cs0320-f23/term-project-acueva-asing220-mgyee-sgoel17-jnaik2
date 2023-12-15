"use client";
import React from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import { BrowserRouter as Router } from "react-router-dom";
import { useRouter } from "next/navigation";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./how-to/page";
import { createRoot } from "react-dom/client";
import About from "./about/page";
import TeamOpt2v2 from "./2v2-optimizer/page";
import TeamOpt3v3 from "./3v3-optimizer/page";
import Signup from "./sign-up/page";
import Login from "./log-in/page";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
} else {
  console.error("Root element with id 'root' not found");
}
// const root = createRoot(rootElement);

// function Root() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<HowTo />} />
//         <Route path="/how-to" element={<HowTo />} />
//         <Route path="/3v3-optimizer" element={<TeamOpt3v3 />} />
//         <Route path="/2v2-optimizer" element={<TeamOpt2v2 />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HowTo />} />
//         <Route path="/how-to" element={<HowTo />} />
//         <Route path="/3v3-optimizer" element={<TeamOpt3v3 />} />
//         <Route path="/2v2-optimizer" element={<TeamOpt2v2 />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </Router>
//   );
// }

// root.render(
//   <Router>
//     <App />
//   </Router>
// );

// function App() {
//   return (
//     <Router>
//       <Root />
//     </Router>
//   );
// }

// root.render(
//   <Router>
//     <App />
//   </Router>
// );

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-to" element={<Home />} />
        <Route path="/3v3-optimizer" element={<TeamOpt3v3 />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

// root.render(
//   <Router>
//     <App />
//   </Router>
// );

export default App;
