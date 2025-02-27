import React from "react";
import { motion } from "framer-motion";
import { Github, Code, Award, Database } from "lucide-react";
import "./About.css";

function About() {
  return (
    <div className="about-page">
      <h1>About Me & This Project</h1>

      <section className="about-section">
        <p>
          Hi, I'm <span className="unique-name">Ajithesh</span>! This project is
          designed to boost productivity by combining tools like Pomodoro
          timers, Notes, and Checklists into one cohesive hub. Each section is
          built with a modern, sleek design and smooth animations. Feel free to
          explore and enjoy the experience!
        </p>
      </section>

      <section className="about-section">
        <h2 className="accent-red">
          Open Source Contribution{" "}
          <motion.span whileHover={{ scale: 1.2 }}>
            <Github size={24} />
          </motion.span>
        </h2>
        <p>
          This project is <code>open source</code> and welcomes contributions.
          Every pull request improves the experience for everyone and helps
          build a collaborative community.
        </p>
      </section>

      <section className="about-section">
        <h2 className="accent-yellow">
          Technologies Used{" "}
          <motion.span whileHover={{ scale: 1.2 }}>
            <Code size={24} />
          </motion.span>
        </h2>
        <ul>
          <li>
            Built with <code>React</code>, <code>JavaScript</code>,{" "}
            <code>HTML</code>, and <code>CSS</code>.
          </li>
          <li>
            Integrated <code>hello-pangea/dnd</code> for smooth drag-and-drop
            functionality.
          </li>
          <li>
            Utilizes <code>localStorage</code> for storing data on your own
            browser.
          </li>
          <li>
            Leveraged limited <code>AI</code> to enhance code suggestions and
            design refinements.
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="accent-purple">
          Credits & Achievements{" "}
          <motion.span whileHover={{ scale: 1.2 }}>
            <Award size={24} />
          </motion.span>
        </h2>
        <ul>
          <li>
            Developed solely using <code>React</code>, <code>JavaScript</code>,
            <code>CSS</code>, and <code>HTML</code>.
          </li>
          <li>
            Leveraged <code>hello-pangea/dnd</code> for intuitive drag-and-drop
            interactions.
          </li>
          <li>
            Employed limited <code>AI</code> to enhance code suggestions and
            design improvements.
          </li>
        </ul>
      </section>

      <section className="about-section">
        <h2 className="accent-blue">
          Data Storage{" "}
          <motion.span whileHover={{ scale: 1.2 }}>
            <Database size={24} />
          </motion.span>
        </h2>
        <p>
          All user data is stored locally in your browser using{" "}
          <code>localStorage</code>. This means your data remains private and is
          only available on your device. Please note that clearing your browser
          history or cache will remove your saved data.
        </p>
      </section>

      <section className="about-section">
        <h2 className="accent-orange">
          GitHub Repository{" "}
          <motion.span whileHover={{ scale: 1.2 }}>
            <Github size={24} />
          </motion.span>
        </h2>
        <p>
          Check out the project on GitHub:{" "}
          <a
            href="https://github.com/Ajithesh9/productivity-hub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code class="hl">
              https://github.com/Ajithesh9/productivity-hub
            </code>
          </a>
        </p>
      </section>
    </div>
  );
}

export default About;
