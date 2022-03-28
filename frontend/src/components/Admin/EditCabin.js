import { useEffect, useState } from 'react';
import './EditCabin.css';

const EditCabin = () => {
  const link = window.location.href;

  const pageName = link.split('/')[4];

  const cabinInfo = {
    name: 'Utsikten',
    active: true,
    shortDescription: 'Denne hytten har en fin utsikt, wow! :)',
    longDescription:
      'Denne hytten har en mega fin utsikt og har derfor fått navnet Utsikten! Wowee!',
    address: 'Grøndalsvegen 764',
    directions: 'Kjør mot Hemsedal, snart er du der hurra!',
    price: 1200,
    cleaningPrice: 1200,
    features: [
      {
        countable: [{ Bad: 1 }, { Soverom: 4 }, { Sengeplasser: 8 }],
        uncountable: [
          { Wifi: false },
          { 'Lader til El-bil': false },
          { 'Spisestue med kjøkken': false },
          { Veranda: false },
          { Steinovnspeis: true },
          { Langbord: true },
          { Komfyr: true },
          { Mikrobølgeovn: true },
        ],
      },
    ],
  };

  const [active, setActive] = useState(cabinInfo.active);
  const [unCountableFuncs, setUncountableFuncs] = useState([]);
  const [countableFuncs, setCountableFuncs] = useState([]);

  useEffect(() => {
    const features = [];
    cabinInfo.features[0].uncountable.map((item) => {
      const name = Object.keys(item)[0];
      const value = Object.values(item)[0];
      const feature = {
        name: name,
        checked: value,
      };
      features.push(feature);
    });

    const countFeatures = [];
    cabinInfo.features[0].countable.map((item) => {
      const countName = Object.keys(item)[0];
      const countValue = Object.values(item)[0];
      const countFeature = {
        name: countName,
        amount: countValue,
      };
      countFeatures.push(countFeature);
    });
    setCountableFuncs(countFeatures);
    setUncountableFuncs(features);
  }, []);

  const onCheckboxInputChange = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;

    const newFuncs = unCountableFuncs.map((item) => {
      if (item.name === name) {
        return {
          ...item,
          checked: checked,
        };
      }
      return item;
    });

    setUncountableFuncs(newFuncs);
  };

  const onActiveChange = () => {
    setActive(!active);
  };

  async function handleEdit() {
    const cabin = {
      name: document.getElementById('edit-name').value,
      active: document.getElementById('edit-active').checked,
      shortDescription: document.getElementById('edit-shortdesc').value,
      longDescription: document.getElementById('edit-longdesc').value,
      address: document.getElementById('edit-address').value,
      directions: document.getElementById('edit-directions').value,
      price: document.getElementById('edit-price').value,
      cleaningPrice: document.getElementById('edit-cleaningprice').value,
      features: [
        {
          countable: [
            { Bad: document.getElementById('edit-Bad').value },
            { Soverom: document.getElementById('edit-Soverom').value },
            {
              Sengeplasser: document.getElementById('edit-Sengeplasser').value,
            },
          ],
          uncountable: [
            { Wifi: document.getElementById('Wifi').checked },
            {
              'Lader til El-bil':
                document.getElementById('Lader til El-bil').checked,
            },
            {
              'Spisestue med kjøkken': document.getElementById(
                'Spisestue med kjøkken'
              ).checked,
            },
            { Veranda: document.getElementById('Veranda').checked },
            { Steinovnspeis: document.getElementById('Steinovnspeis').checked },
            { Langbord: document.getElementById('Langbord').checked },
            { Komfyr: document.getElementById('Komfyr').checked },
            { Mikrobølgeovn: document.getElementById('Mikrobølgeovn').checked },
          ],
        },
      ],
    };
    console.log(cabin);
  }

  return (
    <>
      <div className="edit-cabin-container">
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-name">
            Navn
          </label>
          <input
            className="edit-cabin-input"
            defaultValue={cabinInfo.name}
            type="text"
            id="edit-name"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-address">
            Adresse
          </label>
          <input
            className="edit-cabin-input"
            defaultValue={cabinInfo.address}
            type="text"
            id="edit-address"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-directions">
            Veibeskrivelse
          </label>
          <textarea
            className="edit-cabin-input-short"
            defaultValue={cabinInfo.directions}
            id="edit-directions"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-shortdesc">
            Kort beskrivelse
          </label>
          <textarea
            className="edit-cabin-input-short"
            defaultValue={cabinInfo.shortDescription}
            id="edit-shortdesc"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-longdesc">
            Lang beskrivelse
          </label>
          <textarea
            className="edit-cabin-input-long"
            defaultValue={cabinInfo.longDescription}
            id="edit-longdesc"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-price">
            Pris
          </label>
          <input
            className="edit-cabin-input"
            defaultValue={cabinInfo.price}
            type="number"
            id="edit-price"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-cleaningprice">
            Vaskepris
          </label>
          <input
            className="edit-cabin-input"
            defaultValue={cabinInfo.cleaningPrice}
            type="number"
            id="edit-cleaningprice"
          />
        </div>
        {countableFuncs.map((item) => (
          <div className="edit-cabin-wrapper" key={item.name}>
            <label className="edit-cabin-label" htmlFor={'edit-' + item.name}>
              {item.name}
            </label>
            <input
              className="edit-cabin-input"
              defaultValue={item.amount}
              type="number"
              id={'edit-' + item.name}
            />
          </div>
        ))}
        <div className="edit-cabin-cbwrapper">
          <label className="edit-cabin-label" htmlFor="edit-active">
            Kan søkes på
          </label>
          <input
            className="edit-cabin-checkbox"
            type="checkbox"
            defaultValue={active}
            id="edit-active"
            checked={active}
            onChange={onActiveChange}
          />
        </div>
        <div className="edit-funcs-container">
          <p className="funcs-title">Funksjonalitetsliste</p>
          <div className="input-funcs">
            {unCountableFuncs.map((functionality) => (
              <div className="input-function" key={functionality.name}>
                <input
                  className="edit-cabin-checkbox"
                  type="checkbox"
                  id={functionality.name}
                  name={functionality.name}
                  checked={functionality.checked}
                  value={functionality.name}
                  onChange={onCheckboxInputChange}
                />
                <label className="func-label" htmlFor={functionality.name}>
                  {functionality.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button className="btn small" onClick={handleEdit}>
          Endre
        </button>
      </div>
    </>
  );
};

export default EditCabin;
