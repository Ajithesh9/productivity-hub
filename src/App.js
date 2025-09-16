import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import Notes from "./components/Notes/Notes";
import Checklist from "./components/Checklist/Checklist";
import About from "./components/about/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Pomodoro />} />
          <Route path="notes" element={<Notes />} />
          <Route path="checklist" element={<Checklist />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;