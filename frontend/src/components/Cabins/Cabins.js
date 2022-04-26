import { useState, useEffect } from 'react';
//import LoginContext from '../../LoginContext/login-context';
import CabinCardBig from '../01-Reusable/CabinCard/CabinCardBig';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './Cabins.css';
import MapCabins from '../01-Reusable/MapCabin/MapCabins';

const Cabins = () => {
  //const loginContext = useContext(LoginContext);
  //const loggedIn = loginContext.loggedIn;

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
      <HeroBanner name="Hytter" />
      <div className="cabins-display">
        {cabins.length > 0 &&
          cabins.map((cabin, index) => {
            return <CabinCardBig key={index} cabin={cabin} />;
          })}
      </div>
      {console.log(cabins)}
      {cabins.length > 0 && (
        <MapCabins cabins={cabins} pickedCabin={cabins[0]} />
      )}
    </>
  );
};

export default Cabins;
