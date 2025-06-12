import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.jsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </main>
      <Footer />
    </div>
  );
}

export default App;
