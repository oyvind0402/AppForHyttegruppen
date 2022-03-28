import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="footer-container">
        <p>&copy; {currentYear} Accenture. All rights reserved</p>
      </div>
    </>
  );
}

export default Footer;
