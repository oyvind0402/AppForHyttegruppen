import React from 'react';
import './ProfilePopup.css';

const ProfilePopup = (props) => {
  return (
    <>
      <div id="profile-popup" className="profile-popup-bg">
        {props.children}
      </div>
    </>
  );
};

export default ProfilePopup;
