import { useEffect, useState } from 'react';
import BackButton from '../01-Reusable/Buttons/BackButton';
import CabinCardBig from '../01-Reusable/CabinCard/CabinCardBig';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';

const EditCabins = () => {
  const [cabins, setCabins] = useState(['']);

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
      <BackButton name="Tilbake til sideinnhold" link="endringer" />
      <HeroBanner name="Endre hytter" />
      <div className="cabins-display">
        {cabins[0] !== '' &&
          cabins.map((cabin, index) => {
            return <CabinCardBig key={index} cabin={cabin} />;
          })}
      </div>
    </>
  );
};

export default EditCabins;
