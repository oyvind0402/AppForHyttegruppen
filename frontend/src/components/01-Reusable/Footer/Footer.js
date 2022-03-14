import React from 'react'
import "./Footer.css"
import {ReactComponent as Copyright} from "./copyright_black_24dp.svg"
import {Link, useHistory} from "react-router-dom"

function Footer() {
  return (
      <>
    <div className="footer-container">
      <div className="link-container">
        <div className="link-row-container">
        <Link className='footer-links' to="/"> 
        Hjem
        </Link>
           <Link className='footer-links' to="/hytter"> 
        HyttePortal
        </Link>
        <Link className='footer-links' to="/soknad"> 
        Søknad
        </Link>
        
        </div>
       <div className="link-row-container">
           <Link className='footer-links' to="/hytteomraader"> 
        Hemsedal
        </Link>
        <Link className='footer-links' to="/faq"> 
        FAQ
        </Link>
        
       </div>
      <div className="copyright_container">
        
        <Copyright className="copyright"></Copyright>
        <p>2022 Accenture. All rights reserved</p>
      </div>
      </div>
    </div>
      </>
    
  )
}

export default Footer