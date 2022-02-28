import React from 'react';
import './ProfilePopup.css';

const ProfilePopup = (props) => {
  return (
    <>
      <div id="profil-popup" className="profil-popup-bg">
        {props.children}
      </div>
    </>
  );
};

export default ProfilePopup;
