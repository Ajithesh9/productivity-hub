import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Pomodoro from "./components/Pomodoro/Pomodoro";
import Notes from "./components/Notes/Notes";
import Checklist from "./components/Checklist/Checklist";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Pomodoro />} />
          <Route path="notes" element={<Notes />} />
          <Route path="checklist" element={<Checklist />} />
          {/* MusicPlayer and Quotes are included in Layout */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
