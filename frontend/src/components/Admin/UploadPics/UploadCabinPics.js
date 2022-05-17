import { useEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminPictureCabinCardBig from '../../01-Reusable/CabinCard/AdminPictureCabinCard';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import './UploadCabinPics.css';

const UploadCabinPics = () => {
  const [cabins, setCabins] = useState([]);

  useEffect(() => {
    async function getCabin() {
      fetch('/api/cabin/all')
        .then((response) => response.json())
        .then((data) => {
          setCabins(data);
        });
    }
    getCabin();
  }, []);

  return (
    <>
      <BackButton
        name="Tilbake til rediger bilder"
        link="admin/redigerbilder"
      />
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
