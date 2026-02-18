import React from "react";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>About This Project</h1>
        <p>
          This is a full-stack Todo application built using:
        </p>

        <ul>
          <li>⚛ React (Frontend)</li>
          <li>🐍 Flask (Backend API)</li>
          <li>🗄 SQLAlchemy + SQLite (Database)</li>
        </ul>

        <p>
          This project demonstrates REST APIs, CRUD operations,
          modern UI design, and full-stack architecture.
        </p>
      </div>
    </div>
  );
};

export default About;
