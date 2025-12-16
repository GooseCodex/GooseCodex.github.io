import React from 'react'
import './App.css'
import ContactForm from './components/ContactForm.jsx'
// NOTE: Make sure your index.css (or whichever file holds the :root colors) is still linked in index.html

// Placeholder Data - Replace this later!
// NOTE: I added back 'tech' and 'desc' so the card is complete.
const projects = [
    {
        id: 1,
        title: "OpenPOS",
        tech: ".NET Maui",
        desc: "A modern, point-of-sale system for small businesses.",
        image: "/openpos_logo_v1.png", // NOTE: The path should start with / if using public folder
        repo:"https://github.com/ICTOOSDDd4/OpenPOS"
    }
];

function App() {
    // 1. Removed the 'styles' object entirely!

    return (
        <div className="container">
            {/* Hero Section */}
            {/* 2. Replaced style={styles.header} with className="header" */}
            <header className="header">
                <img
                    // 3. Replaced style={styles.avatar} with className="avatar"
                    src="/profile-p.jpg"
                    alt="Profile"
                    className="avatar"
                />
                <h1 style={{fontSize: '3rem', margin: '0.5rem 0'}}>GooseCodex</h1>
                <p style={{fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto'}}>
                    Web Developer
                </p>
                {/* 4. Replaced inline flex with className="social-links" */}
                <div className="social-links">
                    <a href="https://github.com/GooseCodex" className="btn">GitHub</a>
                    <a href="https://www.linkedin.com/in/guus-van-der-snel-631818266/" className="btn">LinkedIn</a>
                </div>
            </header>

            <hr style={{borderColor: 'var(--text-primary)', opacity: 0.2}} />

            {/* Projects Section */}
            <main>
                <h2 style={{marginTop: '3rem', color: 'var(--text-primary)'}}>Selected Works</h2>
                {/* 5. Replaced style={styles.grid} with className="project-grid" */}
                <div className="project-grid">
                    {projects.map((project) => (
                        // 6. Replaced style={styles.card} with className="project-card"
                        <div key={project.id} className="project-card">
                            {/* NEW: Image container for 16:9 ratio */}
                            <div className="image-container">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="project-image"
                                />
                            </div>

                            {/* 7. Replaced style={styles.cardContent} with className="card-content" */}
                            <div className="card-content">
                                <h3 className="card-title">{project.title}</h3>
                                {/* 8. Replaced style={...} with className="tech-stack" */}
                                <small className="tech-stack">{project.tech}</small>
                                <p>{project.desc}</p>
                                {/* 9. Applied new utility class btn-small */}
                                <a href={project.repo} className="btn btn-small">View Code</a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <ContactForm />
            
            <footer>
                <p>© 2025 GooseCodex. Built with React.</p>
            </footer>
        </div>
    )
}

export default App