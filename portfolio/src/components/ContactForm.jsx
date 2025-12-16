import React from 'react';
import '../App.css'; // Use App.css styles

function ContactForm() {
    
    return (
        <section style={{ margin: '4rem 0', padding: '2rem 0', borderTop: '1px solid var(--accent)' }}>
            <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                Get In Touch
            </h2>

            <form
                action="https://formspree.io/f/manrgovk"
                method="POST"
                className="contact-form-grid"
            >
                {/* Name Field */}
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" required />
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="_replyto" required />
                </div>

                {/* Message Field */}
                <div style={{ gridColumn: '1 / -1' }}> {/* Span across both columns */}
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn" style={{ gridColumn: '1 / -1', marginTop: '1rem', width: 'fit-content', justifySelf: 'center' }}>
                    Send Message
                </button>
            </form>
        </section>
    );
}

export default ContactForm;