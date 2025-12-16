import React from 'react'
import './App.css'
import ContactForm from './components/ContactForm.jsx'


const projects = [
    {
        id: 1,
        title: "OpenPOS",
        tech: ".NET Maui",
        desc: "A modern, point-of-sale system for small businesses.",
        image: "/openpos_logo_v1.png",
        repo:"https://github.com/ICTOOSDDd4/OpenPOS"
    }
];

function App() {

    return (
        <div className="container">
            {/* Hero Section */}
            <header className="header">
                <img
                    src="/profile-p.jpg"
                    alt="Profile"
                    className="avatar"
                />
                <h1 style={{fontSize: '3rem', margin: '0.5rem 0'}}>GooseCodex</h1>
                <p style={{fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto'}}>
                    Web Developer
                </p>
                <div className="social-links">
                    <a href="https://github.com/GooseCodex" className="btn">GitHub</a>
                    <a href="https://www.linkedin.com/in/guus-van-der-snel-631818266/" className="btn">LinkedIn</a>
                </div>
            </header>

            <hr style={{borderColor: 'var(--text-primary)', opacity: 0.2}} />

            {/* Projects Section */}
            <main>
                <h2 style={{marginTop: '3rem', color: 'var(--text-primary)'}}>Selected Works</h2>
                <div className="project-grid">
                    {projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <div className="image-container">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="project-image"
                                />
                            </div>
                            
                            <div className="card-content">
                                <h3 className="card-title">{project.title}</h3>
                                <small className="tech-stack">{project.tech}</small>
                                <p>{project.desc}</p>
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