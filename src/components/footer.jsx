import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '2rem 0',
    marginTop: 'auto'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const sectionStyle = {
    flex: 1,
    margin: '0 1rem'
  };

  const headingStyle = {
    fontSize: '1.2rem',
    marginBottom: '1rem'
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '0.5rem'
  };

  const copyrightStyle = {
    textAlign: 'center',
    padding: '1rem 0',
    borderTop: '1px solid #555',
    marginTop: '2rem'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={headingStyle}>About Us</h3>
          <p>We are dedicated to providing the best service to our customers.</p>
        </div>
        
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Quick Links</h3>
          <a href="/" style={linkStyle}>Home</a>
          <a href="/about" style={linkStyle}>About</a>
          <a href="/services" style={linkStyle}>Services</a>
          <a href="/contact" style={linkStyle}>Contact</a>
        </div>
        
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Contact Info</h3>
          <p>Email: info@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Street Name, City, Country</p>
        </div>
      </div>
      
      <div style={copyrightStyle}>
        <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 