import React, { useState } from 'react'
import './App.css'
import TowerCanvas from './components/TowerCanvas.jsx'
import ContactForm from './components/ContactForm.jsx'

const projects = [
    {
        id: 1,
        title: "OpenPOS",
        role: "Student Developer",
        status: "School Project",
        tech: [".NET MAUI", "C#", "SQL Server"],
        license: "GPL v3.0",
        desc: "An open-source point-of-sale system built for small businesses and entrepreneurs. Designed to modernize retail checkout and sales management without requiring complex infrastructure — running natively across Windows, Android, iOS and macOS from a single codebase.",
        details: [
            "Modular architecture split across dedicated API, controller, database and model layers",
            "Integrated Tikkie payment processing for seamless iDEAL-style Dutch transactions",
            "Cross-platform deployment via .NET MAUI — one codebase targeting desktop and mobile",
            "SQL Server persistence layer with 669+ commits and automated CI/CD quality workflows",
        ],
        repo: "https://github.com/ICTOOSDDd4/OpenPOS",
    },
    {
        id: 2,
        title: "Qanteon Q-PID",
        role: "Internship — Software Engineer",
        status: "Production",
        tech: ["C#", ".NET 10", "Avalonia 11", "Azure IoT Hub", "SSH / MQTT"],
        license: "Proprietary",
        gif: '/qpid-demo.gif',
        desc: "A self-contained Windows tray application that streams live BMS datapoint change events to Azure IoT Hub. Built during a professional internship at Qanteon, Q-PID bridges on-site Linux BMS installations to cloud IoT infrastructure through a resilient, secure, and fully configurable pipeline.",
        details: [
            "Connects to Linux BMS VMs over SSH, runs DPfilter remotely and parses BACnet and LON protocol change events from stdout",
            "Entra ID device-code authentication with Infisical OIDC session — no secrets written to disk at any point",
            "Offline SQLite message cache (up to 100k entries) with automatic drain on MQTTS reconnect after network loss",
            "Avalonia 11 system tray UI with WorkerController managing IHost lifecycle and auto-restart on crash",
            "Configurable throttling, batching, and DryRun mode for safe on-site demos without touching Azure",
            "Self-installs to C:\\q-pid\\ on first launch with auto-update support via Azure Blob URL",
        ],
        repo: null,
    },
];

const NAV_ITEMS = [
    { id: 'profile', label: 'PROFILE', symbol: '△', color: 'var(--ps2-triangle)' },
    { id: 'works',   label: 'WORKS',   symbol: '◯', color: 'var(--ps2-circle)'   },
    { id: 'contact', label: 'CONTACT', symbol: '✕', color: 'var(--ps2-cross)'    },
];

function ProfileSection() {
    return (
        <div className="ps2-profile">
            <img src="/profile-p.jpg" alt="Profile" className="ps2-avatar" />
            <h1 className="ps2-title">GooseCodex</h1>
            <p className="ps2-role">Web Developer</p>
            <div className="ps2-links">
                <a href="https://github.com/GooseCodex" target="_blank" rel="noreferrer" className="ps2-link-btn">
                    <span style={{ color: 'var(--ps2-square)' }}>□</span> GitHub
                </a>
                <a href="https://www.linkedin.com/in/guus-van-der-snel-631818266/" target="_blank" rel="noreferrer" className="ps2-link-btn">
                    <span style={{ color: 'var(--ps2-square)' }}>□</span> LinkedIn
                </a>
            </div>
        </div>
    );
}

function WorksSection() {
    return (
        <div className="ps2-works">
            <h2 className="ps2-works-heading">SELECTED WORKS</h2>
            {projects.map(p => (
                <div key={p.id} className="ps2-project-card">

                    <div className="ps2-project-header">
                        <div>
                            <h3 className="ps2-project-title">{p.title}</h3>
                            <span className="ps2-project-role">{p.role}</span>
                        </div>
                        <span className="ps2-status-badge">{p.status}</span>
                    </div>

                    <div className="ps2-tech-tags">
                        {p.tech.map(t => (
                            <span key={t} className="ps2-tech-tag">{t}</span>
                        ))}
                        <span className="ps2-license-tag">{p.license}</span>
                    </div>

                    <div className="ps2-project-divider" />

                    <p className="ps2-project-desc">{p.desc}</p>

                    <ul className="ps2-project-details">
                        {p.details.map((d, i) => (
                            <li key={i}>{d}</li>
                        ))}
                    </ul>

                    {'gif' in p && (
                        <div className="ps2-gif-area">
                            {p.gif
                                ? <img src={p.gif} alt={`${p.title} demo`} className="ps2-gif-img" />
                                : (
                                    <div className="ps2-gif-placeholder">
                                        <span>▶</span>
                                        <span>DEMO FOOTAGE</span>
                                        <span className="ps2-gif-sub">replace gif path to activate</span>
                                    </div>
                                )
                            }
                        </div>
                    )}

                    <div className="ps2-project-footer">
                        {p.repo
                            ? (
                                <a href={p.repo} target="_blank" rel="noreferrer" className="ps2-link-btn">
                                    <span style={{ color: 'var(--ps2-cross)' }}>✕</span> View Code
                                </a>
                            ) : (
                                <span className="ps2-private-badge">
                                    <span style={{ color: 'var(--ps2-circle)' }}>○</span> Private Repository
                                </span>
                            )
                        }
                    </div>

                </div>
            ))}
        </div>
    );
}

function App() {
    const [active, setActive] = useState('profile');

    return (
        <div className="ps2-app">

            {/* ── 3D canvas background ── */}
            <TowerCanvas />

            {/* ── Scanline CSS overlay ── */}
            <div className="ps2-scanlines" />

            {/* ── Top bar ── */}
            <header className="ps2-topbar">
                <span className="ps2-logo-text">GOOSECODEX</span>
                <span className="ps2-version">PORTFOLIO · v1.0</span>
            </header>

            {/* ── Center content ── */}
            <div className="ps2-content-area">
                {active === 'works' ? (
                    <div className="ps2-works-area" key="works">
                        <WorksSection />
                    </div>
                ) : (
                    <div className="ps2-panel" key={active}>
                        {active === 'profile' && <ProfileSection />}
                        {active === 'contact' && <ContactForm />}
                    </div>
                )}
            </div>

            {/* ── Bottom dock ── */}
            <nav className="ps2-dock">
                {NAV_ITEMS.map(({ id, label, symbol, color }) => (
                    <button
                        key={id}
                        className={`ps2-dock-btn${active === id ? ' active' : ''}`}
                        onClick={() => setActive(id)}
                        style={{ '--sym-color': color }}
                    >
                        <span className={`ps2-dock-symbol${symbol === '◯' ? ' ps2-dock-symbol--circle' : ''}`}>
                            {symbol}
                        </span>
                        <span className="ps2-dock-label">{label}</span>
                    </button>
                ))}
            </nav>

        </div>
    );
}

export default App