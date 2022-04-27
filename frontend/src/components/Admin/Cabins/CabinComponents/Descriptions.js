import { useEffect, useState } from 'react';

const Descriptions = (props) => {
  const [directions, setDirections] = useState('');
  const [errorDirections, setErrorDirections] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [errorShortDescription, setErrorShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [errorLongDescription, setErrorLongDescription] = useState('');
  const [garbageCollection, setGarbageCollection] = useState('');
  const [errorGarbageCollection, setErrorGarbageCollection] = useState('');

  useEffect(() => {
    setErrorDirections('');
    if (directions.length !== 0) {
      if (directions.length < 10)
        setErrorDirections('Veibeskrivelse må være lengere en 10 tegn!');
      if (errorDirections === '') props.setDirections(directions);
      if (errorDirections !== '') props.setDirections('');
    }
  }, [directions]);

  useEffect(() => {
    setErrorShortDescription('');
    if (shortDescription.length !== 0) {
      if (shortDescription.length < 10)
        setErrorShortDescription(
          'Kort beskrivelse må være lengere en 10 tegn!'
        );
      if (errorShortDescription === '')
        props.setShortDescription(shortDescription);
      if (errorShortDescription !== '') props.setShortDescription('');
    }
  }, [shortDescription]);

  useEffect(() => {
    setErrorLongDescription('');
    if (longDescription.length !== 0) {
      if (longDescription.length < 10)
        setErrorLongDescription('Lang beskrivelse må være lengere en 10 tegn!');
      if (errorLongDescription === '')
        props.setLongDescription(longDescription);
      if (errorLongDescription !== '') props.setLongDescription('');
    }
  }, [longDescription]);

  useEffect(() => {
    setErrorGarbageCollection('');
    if (garbageCollection.length !== 0) {
      if (garbageCollection.length < 10)
        setErrorGarbageCollection(
          'Kildesortering info må være lengere en 10 tegn!'
        );
      if (errorGarbageCollection === '')
        props.setGarbageCollection(garbageCollection);
      if (errorGarbageCollection !== '') props.setGarbageCollection('');
    }
  }, [garbageCollection]);

  return (
    <>
      <div className="add-cabin-wrapper">
        <label className="add-cabin-label" htmlFor="add-directions">
          Veibeskrivelse
        </label>
        <textarea
          placeholder="Skriv inn veibeskrivelsen.."
          className="add-cabin-input input-long"
          id="add-directions"
          onChange={(e) => setDirections(e.target.value)}
        />
        {errorDirections !== '' && (
          <span className="login-error">{errorDirections}</span>
        )}
      </div>
      <div className="add-cabin-wrapper">
        <label className="add-cabin-label" htmlFor="add-shortdesc">
          Kort beskrivelse
        </label>
        <textarea
          placeholder="Skriv inn en kort beskrivelse.."
          className="add-cabin-input input-short"
          id="add-shortdesc"
          onChange={(e) => setShortDescription(e.target.value)}
        />
        {errorShortDescription !== '' && (
          <span className="login-error">{errorShortDescription}</span>
        )}
      </div>
      <div className="add-cabin-wrapper">
        <label className="add-cabin-label" htmlFor="add-longdesc">
          Lang beskrivelse
        </label>
        <textarea
          placeholder="Skriv inn en lang beskrivelse.."
          className="add-cabin-input input-long"
          id="add-longdesc"
          onChange={(e) => setLongDescription(e.target.value)}
        />
        {errorLongDescription !== '' && (
          <span className="login-error">{errorLongDescription}</span>
        )}
      </div>
      <div className="add-cabin-wrapper">
        <label className="add-cabin-label" htmlFor="add-recycling">
          Kildesortering info
        </label>
        <textarea
          placeholder="Skriv inn info om kildesortering.."
          className="add-cabin-input input-long"
          id="add-recycling"
          onChange={(e) => setGarbageCollection(e.target.value)}
        />
        {props.errorGarbageCollection !== '' && (
          <span className="login-error">{errorGarbageCollection}</span>
        )}
      </div>
    </>
  );
};

export default Descriptions;
