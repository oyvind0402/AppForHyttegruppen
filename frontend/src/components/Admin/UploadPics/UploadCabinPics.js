import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminPictureCabinCardBig from '../../01-Reusable/CabinCard/AdminPictureCabinCard';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import './UploadCabinPics.css';

const UploadCabinPics = () => {
  const [cabins, setCabins] = useState([]);

  const getCabin = async () => {
    const response = await fetch('/cabin/all');
    const data = await response.json();
    if (response.ok) {
      setCabins(data);
    }
  };

  useEffect(() => {
    getCabin();
    console.log(cabins);
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <AdminBanner name="Last opp bilder" />
      <p className="upload-pics-title">Last opp bilder for:</p>
      <div className="cabins-display">
        {cabins.length > 0 &&
          cabins.map((cabin, index) => {
            return <AdminPictureCabinCardBig key={index} cabin={cabin} />;
          })}
      </div>
    </>
  );
};

export default UploadCabinPics;
