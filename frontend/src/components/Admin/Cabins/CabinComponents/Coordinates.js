import { useEffect, useState } from 'react';

const Coordinates = (props) => {
  const [latitude, setLatitude] = useState('');
  const [errorLatitude, setErrorLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errorLongitude, setErrorLongitude] = useState('');

  useEffect(() => {
    if (latitude.length !== 0) {
      setErrorLatitude('');
      if (!/^(([1-8]?[0-9])(\.[0-9]{1,6})?|90(\.0{1,6})?)$/i.test(latitude))
        setErrorLatitude('Feil format på breddegrad!');
      if (latitude === 0) setErrorLatitude('Fyll inn breddegraden!');
      if (errorLatitude === '') props.setLatitude(latitude);
      if (errorLatitude !== '') props.setLatitude('');
    }
  }, [latitude]);

  useEffect(() => {
    if (longitude.length !== 0) {
      setErrorLongitude('');
      if (
        !/^((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,6})?)|180(\.0{1,6})?)$/i.test(
          longitude
        )
      )
        setErrorLongitude('Feil format på lengdegrad!');
      if (longitude.length === 0) setErrorLongitude('Fyll inn lengdegraden!');
      if (errorLongitude === '') props.setLongitude(longitude);
      if (errorLongitude !== '') props.setLongitude('');
    }
  }, [longitude]);

  return (
    <>
      <div className="add-cabin-2-2">
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-latitude">
            Breddegrad
          </label>
          <input
            placeholder="Skriv inn breddegraden.."
            className="add-cabin-input"
            type="text"
            id="add-latitude"
            onChange={(e) => setLatitude(e.target.value)}
          />
          {errorLatitude !== '' && (
            <span className="login-error">{errorLatitude}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-longitude">
            Lengdegrad
          </label>
          <input
            placeholder="Skriv inn lengdegraden.."
            className="add-cabin-input"
            type="text"
            id="add-longitude"
            onChange={(e) => setLongitude(e.target.value)}
          />
          {errorLongitude !== '' && (
            <span className="login-error">{errorLongitude}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Coordinates;
