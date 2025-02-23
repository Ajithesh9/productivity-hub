import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <h1>About Me & This Project</h1>
      <p>
        Hi, I'm Ajithesh! This project is designed to help boost productivity by
        combining tools like Pomodoro timers, Notes, and Checklists into one
        cohesive hub. Each section is built with a modern, sleek design and
        features smooth animations. Feel free to explore and enjoy the
        experience!
      </p>
      <p>
        This project is open-source and built using React, leveraging libraries
        such as Framer Motion for animations and localStorage for persistent
        data storage.
      </p>
    </div>
  );
}

export default About;
