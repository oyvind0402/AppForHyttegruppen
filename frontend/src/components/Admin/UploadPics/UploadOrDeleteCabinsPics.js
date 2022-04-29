import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminPictureCabinCardBig from '../../01-Reusable/CabinCard/AdminPictureCabinCard';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './UploadCabinPics.css';

const UploadOrDeleteCabinsPics = () => {
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
      <HeroBanner name="Last opp bilder" />
      <Link className="btn-link big btn" to="/admin/lastoppbilder">
        Legg til bilder
      </Link>
      <Link className="btn-link big btn" to="/admin/slettbilder">
        Fjern bilder
      </Link>
    </>
  );
};

export default UploadOrDeleteCabinsPics;
