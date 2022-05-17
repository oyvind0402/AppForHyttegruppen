import BackButton from '../../01-Reusable/Buttons/BackButton';
import { IoIosRemoveCircle, IoMdAddCircle } from 'react-icons/io';
import './AddCabin.css';
import { useState } from 'react';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';
import { BsQuestionCircle } from 'react-icons/bs';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import Cookies from 'universal-cookie';

const AddCabin = () => {
  const [visible, setVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [explanation, setExplanation] = useState(false);

  const handleAddItem = () => {
    const id = document.getElementById('todolist').childNodes.length;
    const divElement = document.createElement('div');
    divElement.className = 'huskelist-row';

    const labelElement = document.createElement('label');
    labelElement.setAttribute('htmlFor', id);
    labelElement.className = 'huskeliste-label';
    labelElement.textContent = id + ':';

    const node = document.createElement('input');
    node.setAttribute('id', id);
    node.className = 'add-cabin-input-huskelist';
    node.placeholder = 'Skriv inn noe brukeren må huske på..';

    divElement.appendChild(labelElement);
    divElement.appendChild(node);

    document.getElementById('todolist').appendChild(divElement);
  };

  const removeItem = () => {
    if (document.getElementById('todolist').childNodes.length > 1) {
      document
        .getElementById('todolist')
        .removeChild(document.getElementById('todolist').lastChild);
    }
  };

  const handleVisibility = () => {
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

    const huskeliste = document.getElementById('todolist').childNodes;
    for (let i = 1; i < huskeliste.length; i++) {
      if (huskeliste[i].value === '') {
        _errors.huskeliste = 'Det er ikke lov med tome verdier!';
      }
    }

    if (document.getElementById('mainPicture').value.length === 0) {
      _errors.mainPicture = 'Husk å legge til et hovedbilde!';
    } else if (document.getElementById('mainPicture').value.indexOf(' ') > -1) {
      _errors.mainPicture = 'Det er ikke lov med mellomrom i bilde navn!';
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
      _errors.recycling ||
      _errors.huskeliste ||
      _errors.mainPicture
    ) {
      return;
    }

    setVisible(!visible);
  };

  const handleErrorVisibility = () => {
    setErrorVisible(!errorVisible);
  };

  const addCabin = async () => {
    setVisible(false);
    let inputliste = document
      .getElementById('todolist')
      .getElementsByTagName('input');
    let huskeliste = [];
    for (var i = 0; i < inputliste.length; i++) {
      huskeliste.push(inputliste[i].value);
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
          filename: '',
          altText: '',
        },
        otherPictures: [
          {
            filename: '',
            altText: '',
          },
        ],
      },
      other: {
        huskeliste: huskeliste,
        kildesortering: document.getElementById('add-recycling').value,
      },
    };

    try {
      const response = await fetch('/api/cabin/post', {
        method: 'POST',
        body: JSON.stringify(cabin),
        headers: { token: cookies.get('token') },
      });
      const data = await response.json();
      if (response.ok) {
        uploadMainPicture();
      } else {
        setError(data.err);
        setErrorVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cookies = new Cookies();

  const uploadMainPicture = async () => {
    const files = document.getElementById('mainPicture').files[0];
    const formData = new FormData();
    formData.append('altText', document.getElementById('mainPicture').value);
    formData.append('cabinName', document.getElementById('add-name').value);
    formData.append('file', files);

    if (typeof files === 'undefined') {
      return;
    }

    fetch('/api/pictures/main', {
      method: 'POST',
      body: formData,
      headers: {
        token: cookies.get('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
    setSaved(true);
  };

  const handleExplanation = () => {
    setExplanation(!explanation);
  };

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <AdminBanner name="Legg til hytte" />
      <div className="add-cabin-container">
        <div className="add-cabin-1-3">
          <div className="add-cabin-wrapper">
            <label className="add-cabin-label" htmlFor="add-name">
              Navn*
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
              Adresse*
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
        </div>

        <div className="add-cabin-2-2">
          <div className="add-cabin-wrapper">
            <label className="add-cabin-label" htmlFor="add-latitude">
              Breddegrad*
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
              Lengdegrad*
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
        </div>

        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-directions">
            Veibeskrivelse*
          </label>
          <textarea
            placeholder="Skriv inn veibeskrivelsen.."
            className="add-cabin-input input-long"
            id="add-directions"
          />
          {errors.directions && (
            <span className="login-error">{errors.directions}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-shortdesc">
            Kort beskrivelse*
          </label>
          <textarea
            placeholder="Skriv inn en kort beskrivelse.."
            className="add-cabin-input input-short"
            id="add-shortdesc"
          />
          {errors.shortdesc && (
            <span className="login-error">{errors.shortdesc}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-longdesc">
            Lang beskrivelse*
          </label>
          <textarea
            placeholder="Skriv inn en lang beskrivelse.."
            className="add-cabin-input input-long"
            id="add-longdesc"
          />
          {errors.longdesc && (
            <span className="login-error">{errors.longdesc}</span>
          )}
        </div>
        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="add-recycling">
            Kildesortering info*
          </label>
          <textarea
            placeholder="Skriv inn info om kildesortering.."
            className="add-cabin-input input-long"
            id="add-recycling"
          />
          {errors.recycling && (
            <span className="login-error">{errors.recycling}</span>
          )}
        </div>
        <div className="add-cabin-1-1-1">
          <div className="add-cabin-wrapper">
            <label className="add-cabin-label" htmlFor="add-price">
              Leiepris*
            </label>
            <input
              defaultValue={1200}
              className="add-cabin-input"
              type="number"
              id="add-price"
            />
            {errors.price && (
              <span className="login-error">{errors.price}</span>
            )}
          </div>
          <div className="add-cabin-wrapper">
            <label className="add-cabin-label" htmlFor="add-cleaningprice">
              Vaskepris*
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
              Bad*
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
              Soveplasser*
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
              Soverom*
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
              Wifi*
            </label>
            <input
              className="add-cabin-checkbox"
              type="checkbox"
              id={'add-wifi'}
              name={'wifi'}
            />
          </div>
        </div>

        <div className="add-cabin-cbwrapper">
          <label className="add-cabin-label" htmlFor="add-active">
            Kan søkes på*
          </label>
          <input
            className="add-cabin-checkbox"
            type="checkbox"
            id="add-active"
            defaultChecked
          />
          <BsQuestionCircle
            aria-label="More information"
            role="button"
            className="add-cabin-comment add-question"
            onClick={handleExplanation}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExplanation();
              }
            }}
          />

          {explanation && (
            <p className="add-cabin-comment">
              Dersom huket av vil hytten være mulig å søkes på
            </p>
          )}
        </div>
        <div className="add-cabin-wrapper" id="todolist">
          <label className="add-cabin-label">Huskeliste*</label>
          <div className="huskelist-row">
            <label className="huskeliste-label" htmlFor="firstChecklist">
              1:
            </label>
            <input
              type="text"
              className="add-cabin-input-huskelist"
              placeholder="Skriv inn noe brukeren må huske på.."
              id="firstChecklist"
            />
          </div>
          {errors.huskeliste && (
            <span className="login-error">{errors.huskeliste}</span>
          )}
        </div>
        <div className="add-remove-item">
          <IoMdAddCircle
            aria-label="Add checklist element"
            role="button"
            className="add-icon-active"
            onClick={handleAddItem}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddItem();
              }
            }}
          />
          <IoIosRemoveCircle
            aria-label="Remove checklist element"
            role="button"
            className="add-icon-active"
            onClick={removeItem}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                removeItem();
              }
            }}
          />
        </div>

        <div className="add-cabin-wrapper">
          <label className="add-cabin-label" htmlFor="mainPicture">
            Legg til hovedbildet til hytte*
          </label>
          <input
            className="upload-input"
            type="file"
            id="mainPicture"
            name="mainPicture"
            accept=".jpg,.jpeg"
          />
          {errors.mainPicture && (
            <span className="login-error">{errors.mainPicture}</span>
          )}
        </div>

        <button onClick={handleVisibility} className="btn big">
          Legg til
        </button>
      </div>
      {visible && (
        <AlertPopup
          title={'Lagring av hytte'}
          description={
            'Er du sikker på at du vil lagre den nye hytten? Hvis du svarer ja vil ' +
            document.getElementById('add-name').value +
            ' lagres!'
          }
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={addCabin}
        />
      )}
      {errorVisible && (
        <InfoPopup
          btnText="Ok"
          hideMethod={handleErrorVisibility}
          title="Feil med lagring av hytte"
          description={
            "Hytten ble ikke lagret, det skjedde en feil. Server svarte med: '" +
            error +
            "'. Prøv igjen."
          }
        />
      )}
      {saved && (
        <AlertPopup
          title="Hytte lagret!"
          description="Vil du lagre flere bilder av hytta?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={() => {
            setSaved(false);
            window.location.href = '/admin/endrehytter';
          }}
          acceptMethod={() => {
            setSaved(false);
            window.location.href =
              '/admin/lastoppbilde/' +
              document.getElementById('add-name').value;
          }}
        />
      )}
    </>
  );
};

export default AddCabin;
