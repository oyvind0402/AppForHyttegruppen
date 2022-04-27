import { useEffect, useState } from 'react';

const NameAndAdress = (props) => {
  console.log(props.error);
  const [name, setName] = useState('');
  const [errorName, setErrorName] = useState(props.error.errorName);
  const [adress, setAdress] = useState('');
  const [errorAdress, setErrorAdress] = useState(props.error.errorAdress);

  useEffect(() => {
    if (name.length !== 0) {
      setErrorName('');
      if (!/^[a-zA-ZøæåØÆÅ. \\-]{2,20}$/i.test(name))
        setErrorName('Feil format på navn!');
      if (name.length === 0) setErrorName('Fyll inn navn!');
      if (errorName === '') props.setName(name);
      if (errorName !== '') props.setName('');
    }
  }, [name]);

  useEffect(() => {
    if (adress.length !== 0) {
      setErrorAdress('');
      if (!/^[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}$/i.test(adress))
        setErrorAdress('Feil format på adresse!');
      if (adress.length === 0) setErrorAdress('Fyll inn adressen!');
      if (errorAdress === '') props.setAdress(adress);
      if (errorAdress !== '') props.setAdress('');
    }
  }, [adress]);

  return (
    <>
      <div className="add-cabin-1-3">
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-name">
            Navn
          </label>
          <input
            placeholder="Skriv inn navnet.."
            className="add-cabin-input"
            type="text"
            id="add-name"
            onChange={(e) => setName(e.target.value)}
          />
          {errorName !== '' && <span className="login-error">{errorName}</span>}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-address">
            Adresse
          </label>
          <input
            placeholder="Skriv inn adressen.."
            className="add-cabin-input"
            type="text"
            id="add-address"
            onChange={(e) => setAdress(e.target.value)}
          />
          {errorAdress !== '' && (
            <span className="login-error">{errorAdress}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default NameAndAdress;
