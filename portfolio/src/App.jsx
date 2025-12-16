import React from 'react'
import './App.css'

// Placeholder Data - Replace this later!
const projects = [
    { id: 1, title: "Project Alpha", tech: "React • Node.js", desc: "A dashboard for tracking coffee consumption.", gif: "https://via.placeholder.com/400x200/967E76/EEE3CB?text=Project+1+GIF" },
    { id: 2, title: "Project Beta", tech: "Python • AI", desc: "An AI that generates color palettes.", gif: "https://via.placeholder.com/400x200/967E76/EEE3CB?text=Project+2+GIF" },
    { id: 3, title: "Project Gamma", tech: "HTML • CSS", desc: "My first static website clone.", gif: "https://via.placeholder.com/400x200/967E76/EEE3CB?text=Project+3+GIF" }
];

function App() {
    const styles = {
        header: {
            textAlign: 'center',
            padding: '4rem 0',
        },
        avatar: {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '4px solid var(--text-primary)',
            objectFit: 'cover',
            marginBottom: '1rem'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
        },
        card: {
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s ease-in-out'
        },
        cardImg: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            display: 'block'
        },
        cardContent: {
            padding: '1.5rem',
            color: 'var(--text-secondary)'
        }
    };

    return (
        <div className="container">
            {/* Hero Section */}
            <header style={styles.header}>
                <img
                    src="https://via.placeholder.com/150/967E76/EEE3CB?text=Me"
                    alt="Profile"
                    style={styles.avatar}
                />
                <h1 style={{fontSize: '3rem', margin: '0.5rem 0'}}>GooseCodex</h1>
                <p style={{fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto'}}>
                    Full Stack Developer. Building digital experiences with an earthy touch.
                </p>
                <div style={{marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                    <a href="#" className="btn">GitHub</a>
                    <a href="#" className="btn">LinkedIn</a>
                </div>
            </header>

            <hr style={{borderColor: 'var(--text-primary)', opacity: 0.2}} />

            {/* Projects Section */}
            <main>
                <h2 style={{marginTop: '3rem', color: 'var(--text-primary)'}}>Selected Works</h2>
                <div style={styles.grid}>
                    {projects.map((project) => (
                        <div key={project.id} style={styles.card} className="project-card">
                            <img src={project.gif} alt={project.title} style={styles.cardImg} />
                            <div style={styles.cardContent}>
                                <h3 style={{margin: '0 0 0.5rem 0', color: 'var(--text-primary)'}}>{project.title}</h3>
                                <small style={{fontWeight: 'bold', color: 'var(--text-primary)', opacity: 0.8}}>{project.tech}</small>
                                <p>{project.desc}</p>
                                <a href="#" className="btn" style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem'}}>View Code</a>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer style={{textAlign: 'center', marginTop: '4rem', opacity: 0.6}}>
                <p>© 2025 GooseCodex. Built with React.</p>
            </footer>
        </div>
    )
}

export default App