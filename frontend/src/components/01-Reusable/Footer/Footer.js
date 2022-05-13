import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer-container">
        <p>&copy; {currentYear} Accenture. All rights reserved</p>
      </footer>
    </>
  );
}

export default Footer;
