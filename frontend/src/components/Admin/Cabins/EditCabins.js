import { useEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminCabinCardBig from '../../01-Reusable/CabinCard/AdminCabinCard';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';

const EditCabins = () => {
  const [cabins, setCabins] = useState([]);

  //Fetching
  useEffect(() => {
    async function fetchData() {
      fetch('/cabin/all')
        .then((response) => response.json())
        .then((data) => setCabins(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  return (
    <>
      <BackButton name="Tilbake til sideinnhold" link="admin/endringer" />
      <HeroBanner name="Endre hytter" />
      <div className="cabins-display">
        {cabins.length > 0 &&
          cabins.map((cabin, index) => {
            return <AdminCabinCardBig key={index} cabin={cabin} />;
          })}
      </div>
    </>
  );
};

export default EditCabins;
