import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Form Submitted:', formData);
  };

  return (
    <div className="contact-unique-container">
      <h2 className="contact-unique-heading">Contact Us</h2>

      <div className="contact-unique-info">
        <h3>Reach Us At:</h3>
        <p><strong>Email:</strong> your email</p>
        <p><strong>Phone:</strong> (123) 456-7890</p>
        <p><strong>Address:</strong> Washington, D.C. Capital of the United States of America</p>
      </div>

      <div className="contact-unique-form">
        <h3>Send Us a Message:</h3>
        <form onSubmit={handleSubmit} className="contact-unique-form-wrapper">
  <div className="contact-unique-label">
    Name:
    <input 
      type="text" 
      name="name" 
      value={formData.name} 
      onChange={handleChange} 
      required 
      className="contact-unique-input"
    />
  </div>

  <div className="contact-unique-label">
    Email:
    <input 
      type="email" 
      name="email" 
      value={formData.email} 
      onChange={handleChange} 
      required 
      className="contact-unique-input"
    />
  </div>

  <div className="contact-unique-label">
    Message:
    <textarea 
      name="message" 
      value={formData.message} 
      onChange={handleChange} 
      required 
      className="contact-unique-textarea"
    />
  </div>

  <button type="submit" className="contact-unique-button">Submit</button>
</form>

      </div>
    </div>
  );
}

export default Contact;
