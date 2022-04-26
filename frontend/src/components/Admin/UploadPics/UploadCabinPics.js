import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
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
      <HeroBanner name="Last opp bilder" />
      <p className="upload-pics-title">Last opp bilder for:</p>
      <div className="upload-pics-container">
        {cabins?.map((cabin) => {
          return (
            <Link
              to={'/admin/lastoppbilde/' + cabin.name}
              className="btn-smaller link"
            >
              {cabin.name}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default UploadCabinPics;
