import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import { IoIosRemoveCircle, IoMdAddCircle } from 'react-icons/io';
import './AddCabin.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';

const AddCabin = () => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  const handleAddItem = () => {
    const node = document.createElement('input');
    node.className = 'add-cabin-input';
    node.placeholder = 'Skriv inn noe brukeren må huske på..';
    document.getElementById('todolist').appendChild(node);
  };

  const removeItem = () => {
    if (document.getElementById('todolist').hasChildNodes()) {
      if (
        document.getElementById('todolist').lastChild.className !==
        'add-cabin-label'
      ) {
        document
          .getElementById('todolist')
          .removeChild(document.getElementById('todolist').lastChild);
      }
    }
  };

  const cancelPopup = () => {
    setVisible(false);
    setErrorVisible(false);
  };

  const acceptPopup = () => {
    setVisible(false);
    history.push(
      '/admin/lastoppbilde/' + document.getElementById('add-name').value
    );
  };

  const addCabin = async () => {
    let inputliste = document
      .getElementById('todolist')
      .getElementsByTagName('input');
    let huskeliste = [];
    for (var i = 0; i < inputliste.length; i++) {
      huskeliste.push(inputliste[i].value);
    }

    let _errors = {};

    if (document.getElementById('add-name').value.length === 0) {
      _errors.name = 'Fyll inn navn!';
    } else if (
      !/^[a-zA-ZøæåØÆÅ. \\-]{2,20}$/i.test(
        document.getElementById('add-name').value
      )
    ) {
      _errors.name = 'Feil format på navn!';
    }

    if (document.getElementById('add-address').value.length === 0) {
      _errors.address = 'Fyll inn adressen!';
    } else if (
      !/^[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}$/i.test(
        document.getElementById('add-address').value
      )
    ) {
      _errors.address = 'Feil format på adresse!';
    }

    if (document.getElementById('add-latitude').value.length === 0) {
      _errors.latitude = 'Fyll inn breddegraden!';
    } else if (
      !/^(([1-8]?[0-9])(\.[0-9]{1,6})?|90(\.0{1,6})?)$/i.test(
        document.getElementById('add-latitude').value
      )
    ) {
      _errors.latitude = 'Feil format på breddegrad!';
    }

    if (document.getElementById('add-longitude').value.length === 0) {
      _errors.longitude = 'Fyll inn lengdegraden!';
    } else if (
      !/^((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,6})?)|180(\.0{1,6})?)$/i.test(
        document.getElementById('add-longitude').value
      )
    ) {
      _errors.longitude = 'Feil format på lengdegrad!';
    }

    if (document.getElementById('add-directions').value.length === 0) {
      _errors.directions = 'Fyll inn en veibeskrivelse!';
    }

    if (document.getElementById('add-shortdesc').value.length === 0) {
      _errors.shortdesc = 'Fyll inn en kort beskrivelse!';
    }

    if (document.getElementById('add-longdesc').value.length === 0) {
      _errors.longdesc = 'Fyll inn en lang beskrivelse!';
    }

    if (document.getElementById('add-price').value.length === 0) {
      _errors.price = 'Fyll inn en pris!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('add-price').value
      )
    ) {
      _errors.price = 'Feil format på prisen!';
    }

    if (document.getElementById('add-cleaningprice').value.length === 0) {
      _errors.cleaningprice = 'Fyll inn en vaskepris!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('add-cleaningprice').value
      )
    ) {
      _errors.cleaningprice = 'Feil format på vaskeprisen!';
    }

    if (document.getElementById('add-bad').value.length === 0) {
      _errors.bathrooms = 'Fyll inn et antall bad!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(document.getElementById('add-bad').value)
    ) {
      _errors.bathrooms = 'Feil format på antall bad!';
    }

    if (document.getElementById('add-soveplasser').value.length === 0) {
      _errors.sleepingslots = 'Fyll inn et antall soveplasser!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('add-soveplasser').value
      )
    ) {
      _errors.sleepingslots = 'Feil format på antall soveplasser!';
    }

    if (document.getElementById('add-soverom').value.length === 0) {
      _errors.bedrooms = 'Fyll inn et antall soverom!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('add-soverom').value
      )
    ) {
      _errors.bedrooms = 'Feil format på antall soverom!';
    }

    if (document.getElementById('add-recycling').value.length === 0) {
      _errors.recycling = 'Fyll inn kildesortering!';
    }

    setErrors(_errors);

    if (
      _errors.name ||
      _errors.address ||
      _errors.shortdesc ||
      _errors.latitude ||
      _errors.longitude ||
      _errors.directions ||
      _errors.longdesc ||
      _errors.price ||
      _errors.cleaningprice ||
      _errors.bathrooms ||
      _errors.sleepingslots ||
      _errors.bedrooms ||
      _errors.recycling
    ) {
      return;
    }

    const cabin = {
      name: document.getElementById('add-name').value,
      active: document.getElementById('add-active').checked,
      shortDescription: document.getElementById('add-shortdesc').value,
      longDescription: document.getElementById('add-longdesc').value,
      address: document.getElementById('add-address').value,
      directions: document.getElementById('add-directions').value,
      coordinates: {
        latitude: parseFloat(document.getElementById('add-latitude').value),
        longitude: parseFloat(document.getElementById('add-longitude').value),
      },
      price: parseInt(document.getElementById('add-price').value),
      cleaningPrice: parseInt(
        document.getElementById('add-cleaningprice').value
      ),
      features: {
        wifi: document.getElementById('add-wifi').checked,
        bad: parseInt(document.getElementById('add-bad').value),
        sengeplasser: parseInt(
          document.getElementById('add-soveplasser').value
        ),
        soverom: parseInt(document.getElementById('add-soverom').value),
        other: {},
      },
      pictures: {
        mainPicture: {
          filename: 'Utsikten-Main.JPEG',
          altText: 'Main Utsikten',
        },
        otherPictures: [
          {
            filename: 'Utsikten-utsikt1.JPEG',
            altText: 'Utsikten utsikt',
          },
        ],
      },
      other: {
        huskeliste: huskeliste,
        kildesortering: document.getElementById('add-recycling').value,
      },
    };
    console.log(cabin);

    const response = await fetch('/cabin/post', {
      method: 'POST',
      body: JSON.stringify(cabin),
      headers: { token: localStorage.getItem('token') },
    });
    const data = await response.json();
    if (response.ok) {
      setVisible(true);
    } else {
      setError(data.err);
      setErrorVisible(true);
    }
  };

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <HeroBanner name="Legg til hytte" />
      <div className="add-cabin-container">
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-name">
            Navn
          </label>
          <input
            placeholder="Skriv inn navnet.."
            className="add-cabin-input"
            type="text"
            id="add-name"
          />
          {errors.name && <span className="login-error">{errors.name}</span>}
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
          />
          {errors.address && (
            <span className="login-error">{errors.address}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-latitude">
            Breddegrad
          </label>
          <input
            placeholder="Skriv inn breddegraden.."
            className="add-cabin-input"
            type="text"
            id="add-latitude"
          />
          {errors.latitude && (
            <span className="login-error">{errors.latitude}</span>
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
          />
          {errors.longitude && (
            <span className="login-error">{errors.longitude}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-directions">
            Veibeskrivelse
          </label>
          <textarea
            placeholder="Skriv inn veibeskrivelsen.."
            className="add-cabin-input-long"
            id="add-directions"
          />
          {errors.directions && (
            <span className="login-error">{errors.directions}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-shortdesc">
            Kort beskrivelse
          </label>
          <textarea
            placeholder="Skriv inn en kort beskrivelse.."
            className="add-cabin-input-short"
            id="add-shortdesc"
          />
          {errors.shortdesc && (
            <span className="login-error">{errors.shortdesc}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-longdesc">
            Lang beskrivelse
          </label>
          <textarea
            placeholder="Skriv inn en lang beskrivelse.."
            className="add-cabin-input-long"
            id="add-longdesc"
          />
          {errors.longdesc && (
            <span className="login-error">{errors.longdesc}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-price">
            Pris
          </label>
          <input
            defaultValue={1200}
            className="add-cabin-input"
            type="number"
            id="add-price"
          />
          {errors.price && <span className="login-error">{errors.price}</span>}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-cleaningprice">
            Vaskepris
          </label>
          <input
            defaultValue={1200}
            className="add-cabin-input"
            type="number"
            id="add-cleaningprice"
          />
          {errors.cleaningprice && (
            <span className="login-error">{errors.cleaningprice}</span>
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
            id={'add-bad'}
          />
          {errors.bathrooms && (
            <span className="login-error">{errors.bathrooms}</span>
          )}
        </div>

        <div className="add-cabin-wrapper">
          <label className="add-cabin-label2" htmlFor={'add-soveplasser'}>
            Soveplasser
          </label>
          <input
            className="add-cabin-input"
            type="number"
            defaultValue={1}
            id={'add-soveplasser'}
          />
          {errors.sleepingslots && (
            <span className="login-error">{errors.sleepingslots}</span>
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
            id={'add-soverom'}
          />
          {errors.bedrooms && (
            <span className="login-error">{errors.bedrooms}</span>
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
          />
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-recycling">
            Kildesortering info
          </label>
          <textarea
            placeholder="Skriv inn info om kildesortering.."
            className="add-cabin-input-long"
            id="add-recycling"
          />
          {errors.recycling && (
            <span className="login-error">{errors.recycling}</span>
          )}
        </div>
        <div className="add-cabin-cbwrapper">
          <label className="add-cabin-label" htmlFor="add-active">
            Kan søkes på
          </label>
          <input
            className="add-cabin-checkbox"
            type="checkbox"
            id="add-active"
          />
        </div>
        <div className="add-cabin-wrapper" id="todolist">
          <label className="add-cabin-label">Huskeliste</label>
          <input
            type="text"
            className="add-cabin-input"
            placeholder="Skriv inn noe brukeren må huske på.."
          />
        </div>
        <div className="add-remove-item">
          <IoMdAddCircle onClick={handleAddItem} />
          <IoIosRemoveCircle onClick={removeItem} />
        </div>

        <button onClick={addCabin} className="btn big">
          Legg til
        </button>
      </div>
      {visible && (
        <AlertPopup
          title={
            'Vil du legge til bilder for ' +
            document.getElementById('add-name').value +
            '?'
          }
          description={
            document.getElementById('add-name').value +
            ' lagret! Hvis du trykker ja kan du legge til bilder for ' +
            document.getElementById('add-name').value +
            '. Vil du det?'
          }
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={cancelPopup}
          acceptMethod={acceptPopup}
          show={visible}
        />
      )}
      {errorVisible && (
        <InfoPopup
          btnText="Ok"
          hideMethod={cancelPopup}
          title="Feil med lagring av hytte"
          description={
            "Hytten ble ikke lagret, det skjedde en feil. Server svarte med: '" +
            error +
            "'. Prøv igjen."
          }
        />
      )}
    </>
  );
};

export default AddCabin;
