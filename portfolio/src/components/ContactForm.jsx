import React from 'react';
import '../App.css';

function ContactForm() {
    return (
        <>
            <h2 className="ps2-section-heading">GET IN TOUCH</h2>

            <form
                action="https://formspree.io/f/manrgovk"
                method="POST"
                className="ps2-contact-form"
            >
                <div className="ps2-form-row">
                    <div className="ps2-form-field">
                        <label htmlFor="name">NAME</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div className="ps2-form-field">
                        <label htmlFor="email">EMAIL</label>
                        <input type="email" id="email" name="_replyto" required />
                    </div>
                </div>

                <div className="ps2-form-field">
                    <label htmlFor="message">MESSAGE</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                </div>

                <button type="submit" className="ps2-link-btn ps2-submit-btn">
                    <span style={{ color: 'var(--ps2-circle)' }}>○</span> SEND MESSAGE
                </button>
            </form>
        </>
    );
}

export default ContactForm;
