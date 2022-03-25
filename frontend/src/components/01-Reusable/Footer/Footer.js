import React from 'react';
import './Footer.css';
import { Link, useHistory } from 'react-router-dom';

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
