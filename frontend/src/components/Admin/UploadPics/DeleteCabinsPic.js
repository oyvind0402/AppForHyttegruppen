import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminPictureSlettCabinCardBig from '../../01-Reusable/CabinCard/AdminPictureSlettCabinCard';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './UploadCabinPics.css';

const DeleteCabinsPic = () => {
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
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <HeroBanner name="Last opp bilder" />
      <p className="upload-pics-title">Slett bilder for:</p>
      <div className="cabins-display">
        {cabins.length > 0 &&
          cabins.map((cabin, index) => {
            return <AdminPictureSlettCabinCardBig key={index} cabin={cabin} />;
          })}
      </div>
    </>
  );
};

export default DeleteCabinsPic;
