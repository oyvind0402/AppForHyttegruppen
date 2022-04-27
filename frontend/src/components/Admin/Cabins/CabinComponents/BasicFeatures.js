import { useEffect, useState } from 'react';

const BasicFeatures = (props) => {
  const [pris, setPris] = useState(1200);
  const [errorPris, setErrorPris] = useState('');

  const [vaskepris, setVaskepris] = useState(1200);
  const [errorVaskepris, setErrorVaskepris] = useState('');

  const [bad, setBad] = useState(1);
  const [errorBad, setErrorBad] = useState('');

  const [soveplasser, setSoveplasser] = useState(1);
  const [errorSoveplasser, setErrorSoveplasser] = useState('');

  const [soverom, setSoverom] = useState(1);
  const [errorSoverom, setErrorSoverom] = useState('');

  useEffect(() => {
    setErrorPris('');
    if (pris.length !== 0) {
      if (!/^(0|[1-9]{1}[0-9]{0,})$/i.test(pris))
        setErrorPris('Feil format på prisen!');
      if (errorPris === '') props.setPris(pris);
      if (errorPris !== '') props.setPris('');
    }
  }, [pris]);

  useEffect(() => {
    setErrorVaskepris('');
    if (vaskepris.length !== 0) {
      if (!/^(0|[1-9]{1}[0-9]{0,})$/i.test(vaskepris))
        setErrorVaskepris('Feil format på vaskeprisen!');
      if (errorVaskepris === '') props.setVaskepris(vaskepris);
      if (errorVaskepris !== '') props.setVaskepris('');
    }
  }, [vaskepris]);

  useEffect(() => {
    setErrorBad('');
    if (bad.length !== 0) {
      if (!/^(0|[1-9]{1}[0-9]{0,})$/i.test(bad))
        setErrorBad('Feil format på antall bad!');
      if (errorBad === '') props.setBad(bad);
      if (errorBad !== '') props.setBad('');
    }
  }, [bad]);

  useEffect(() => {
    setErrorSoveplasser('');
    if (soveplasser.length !== 0) {
      if (!/^(0|[1-9]{1}[0-9]{0,})$/i.test(soveplasser))
        setErrorSoveplasser('Feil format på antall soveplasser!');
      if (errorSoveplasser === '') props.setSoveplasser(soveplasser);
      if (errorSoveplasser !== '') props.setSoveplasser('');
    }
  }, [soveplasser]);

  useEffect(() => {
    setErrorSoverom('');
    if (soverom.length !== 0) {
      if (!/^(0|[1-9]{1}[0-9]{0,})$/i.test(soverom))
        setErrorSoverom('Feil format på antall soverom!');
      if (errorSoverom === '') props.setSoverom(soverom);
      if (errorSoverom !== '') props.setSoverom('');
    }
  }, [soverom]);

  return (
    <>
      <div className="add-cabin-1-1-1">
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-price">
            Pris
          </label>
          <input
            defaultValue={1200}
            min={0}
            className="add-cabin-input"
            type="number"
            id="add-price"
            onChange={(e) => setPris(e.target.value)}
          />
          {errorPris !== '' && <span className="login-error">{errorPris}</span>}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-cleaningprice">
            Vaskepris
          </label>
          <input
            defaultValue={1200}
            min={0}
            className="add-cabin-input"
            type="number"
            id="add-cleaningprice"
            onChange={(e) => setVaskepris(e.target.value)}
          />
          {errorVaskepris !== '' && (
            <span className="login-error">{errorVaskepris}</span>
          )}
        </div>

        <div className="add-cabin-wrapper">
          <label className="add-cabin-label2" htmlFor={'add-bad'}>
            Bad
          </label>
          <input
            className="add-cabin-input"
            type="number"
            defaultValue={1}
            min={0}
            id={'add-bad'}
            onChange={(e) => setBad(e.target.value)}
          />
          {errorBad !== '' && <span className="login-error">{errorBad}</span>}
        </div>

        <div className="add-cabin-wrapper">
          <label className="add-cabin-label2" htmlFor={'add-soveplasser'}>
            Soveplasser
          </label>
          <input
            className="add-cabin-input"
            type="number"
            defaultValue={1}
            min={0}
            id={'add-soveplasser'}
            onChange={(e) => setSoveplasser(e.target.value)}
          />
          {errorSoveplasser !== '' && (
            <span className="login-error">{errorSoveplasser}</span>
          )}
        </div>

        <div className="add-cabin-wrapper">
          <label className="add-cabin-label2" htmlFor={'add-soverom'}>
            Soverom
          </label>
          <input
            className="add-cabin-input"
            type="number"
            defaultValue={1}
            min={0}
            id={'add-soverom'}
            onChange={(e) => setSoverom(e.target.value)}
          />
          {errorSoverom !== '' && (
            <span className="login-error">{errorSoverom}</span>
          )}
        </div>

        <div className="input-function">
          <label className="add-cabin-label2" htmlFor={'add-wifi'}>
            Wifi
          </label>
          <input
            className="add-cabin-checkbox"
            type="checkbox"
            id={'add-wifi'}
            name={'wifi'}
            onChange={(e) => props.setWifi(e.target.checked)}
          />
        </div>
      </div>
    </>
  );
};

export default BasicFeatures;
