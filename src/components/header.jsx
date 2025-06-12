import React from 'react';

const Header = () => {
  const headerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '1rem 0'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333'
  };

  const navStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const listStyle = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '2rem'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 500
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>My Website</h1>
        <nav style={navStyle}>
          <ul style={listStyle}>
            <li><a href="/" style={linkStyle}>Home</a></li>
            <li><a href="/about" style={linkStyle}>About</a></li>
            <li><a href="/contact" style={linkStyle}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 