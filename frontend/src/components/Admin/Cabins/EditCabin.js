import { useEffect, useState } from 'react';
import { IoIosRemoveCircle, IoMdAddCircle } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';
import './EditCabin.css';

const EditCabin = () => {
  const [cabin, setCabin] = useState([]);
  const [visible, setVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const link = window.location.href;
  const history = useHistory();

  let cabinName = link.split('/')[5];
  if (cabinName.includes('%20') || cabinName.includes('%C3%B8')) {
    let fix = cabinName.replace('%20', ' ');
    cabinName = fix.replace('%C3%B8', 'ø');
  }

  const fetchCabin = async () => {
    const response = await fetch('/cabin/' + cabinName, {
      method: 'GET',
    });

    const data = await response.json();
    if (response.ok) {
      let copy = [];
      copy.push(data);
      setCabin(copy);
    }
  };

  useEffect(() => {
    fetchCabin();
    console.log(cabin);
  }, []);

  const handleAddItem = () => {
    const node = document.createElement('input');
    node.className = 'edit-cabin-input';
    document.getElementById('todolist').appendChild(node);
  };

  const removeItem = () => {
    if (document.getElementById('todolist').hasChildNodes()) {
      if (
        document.getElementById('todolist').lastChild.className !==
        'edit-cabin-label'
      ) {
        document
          .getElementById('todolist')
          .removeChild(document.getElementById('todolist').lastChild);
      }
    }
  };

  const handleVisibility = () => {
    let _errors = {};

    if (document.getElementById('edit-name').value.length === 0) {
      _errors.name = 'Fyll inn navn!';
    } else if (
      !/^[a-zA-ZøæåØÆÅ. \\-]{2,20}$/i.test(
        document.getElementById('edit-name').value
      )
    ) {
      _errors.name = 'Feil format på navn!';
    }

    if (document.getElementById('edit-address').value.length === 0) {
      _errors.address = 'Fyll inn adressen!';
    } else if (
      !/^[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}$/i.test(
        document.getElementById('edit-address').value
      )
    ) {
      _errors.address = 'Feil format på adresse!';
    }

    if (document.getElementById('edit-latitude').value.length === 0) {
      _errors.latitude = 'Fyll inn breddegraden!';
    } else if (
      !/^(([1-8]?[0-9])(\.[0-9]{1,6})?|90(\.0{1,6})?)$/i.test(
        document.getElementById('edit-latitude').value
      )
    ) {
      _errors.latitude = 'Feil format på breddegrad!';
    }

    if (document.getElementById('edit-longitude').value.length === 0) {
      _errors.longitude = 'Fyll inn lengdegraden!';
    } else if (
      !/^((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,6})?)|180(\.0{1,6})?)$/i.test(
        document.getElementById('edit-longitude').value
      )
    ) {
      _errors.longitude = 'Feil format på lengdegrad!';
    }

    if (document.getElementById('edit-directions').value.length === 0) {
      _errors.directions = 'Fyll inn en veibeskrivelse!';
    }

    if (document.getElementById('edit-shortdesc').value.length === 0) {
      _errors.shortdesc = 'Fyll inn en kort beskrivelse!';
    }

    if (document.getElementById('edit-longdesc').value.length === 0) {
      _errors.longdesc = 'Fyll inn en lang beskrivelse!';
    }

    if (document.getElementById('edit-price').value.length === 0) {
      _errors.price = 'Fyll inn en pris!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('edit-price').value
      )
    ) {
      _errors.price = 'Feil format på prisen!';
    }

    if (document.getElementById('edit-cleaningprice').value.length === 0) {
      _errors.cleaningprice = 'Fyll inn en vaskepris!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('edit-cleaningprice').value
      )
    ) {
      _errors.cleaningprice = 'Feil format på vaskeprisen!';
    }

    if (
      document.getElementById('edit-bad').value.length === 0 ||
      document.getElementById('edit-sengeplasser').value.length === 0 ||
      document.getElementById('edit-soverom').value.length === 0
    ) {
      _errors.numbers = 'Fyll inn et antall!';
    } else if (
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('edit-bad').value
      ) ||
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('edit-sengeplasser').value
      ) ||
      !/^(0|[1-9]{1}[0-9]{0,})$/i.test(
        document.getElementById('edit-soverom').value
      )
    ) {
      _errors.numbers = 'Feil format på antallet!';
    }

    if (document.getElementById('edit-recycling').value.length === 0) {
      _errors.recycling = 'Fyll inn kildesortering!';
    }

    setErrorMessage(_errors);

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
    setVisible(!visible);
  };

  const handleErrorVisibility = () => {
    setErrorVisible(!errorVisible);
  };

  const handleSavedVisibility = () => {
    setSaved(!saved);
  };

  async function handleEdit() {
    let inputliste = document
      .getElementById('todolist')
      .getElementsByTagName('input');
    let huskeliste = [];
    for (var x = 0; x < inputliste.length; x++) {
      huskeliste.push(inputliste[x].value);
    }
    const cabin2 = {
      name: document.getElementById('edit-name').value,
      active: document.getElementById('edit-active').checked,
      shortDescription: document.getElementById('edit-shortdesc').value,
      longDescription: document.getElementById('edit-longdesc').value,
      address: document.getElementById('edit-address').value,
      directions: document.getElementById('edit-directions').value,
      coordinates: {
        latitude: parseFloat(document.getElementById('edit-latitude').value),
        longitude: parseFloat(document.getElementById('edit-longitude').value),
      },
      price: parseInt(document.getElementById('edit-price').value),
      cleaningPrice: parseInt(
        document.getElementById('edit-cleaningprice').value
      ),
      features: {
        wifi: document.getElementById('wifi').checked,
        bad: parseInt(document.getElementById('edit-bad').value),
        sengeplasser: parseInt(
          document.getElementById('edit-sengeplasser').value
        ),
        soverom: parseInt(document.getElementById('edit-soverom').value),
      },
      pictures: cabin[0].pictures,

      other: {
        huskeliste: huskeliste,
        kildesortering: document.getElementById('edit-recycling').value,
      },
    };

    const response = await fetch('/cabin/update', {
      method: 'PUT',
      body: JSON.stringify(cabin2),
      headers: { token: localStorage.getItem('refresh_token') },
    });

    const data = await response.json();
    if (response.ok) {
      if (document.getElementById('mainPictureEndre').value !== '') {
        uploadMainPicture();
      } else {
        setSaved(true);
      }
    } else {
      setError(data.err);
      setErrorVisible(true);
    }
    setVisible(false);
    return;
  }

  const uploadMainPicture = async () => {
    const files = document.getElementById('mainPictureEndre').files[0];
    const formData = new FormData();
    formData.append('file', files);
    formData.append(
      'altText',
      document.getElementById('mainPictureEndre').value
    );
    formData.append('cabinName', document.getElementById('edit-name').value);

    if (typeof files === 'undefined') {
      return;
    }

    fetch('/pictures/main', {
      method: 'POST',
      body: formData,
      headers: {
        token: localStorage.getItem('refresh_token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });

    fetch('/pictures/replaceFirst', {
      method: 'POST',
      body: formData,
      headers: {
        token: localStorage.getItem('refresh_token'),
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

  return (
    <>
      <BackButton name="Tilbake til endre hytter" link="admin/endrehytter" />
      <div className="edit-cabin-container">
        <div className="edit-cabin-1-3">
          <div className="edit-cabin-wrapper">
            <label className="edit-cabin-label" htmlFor="edit-name">
              Navn
            </label>
            <input
              className="edit-cabin-input"
              defaultValue={cabin.length !== 0 ? cabin[0].name : ''}
              type="text"
              id="edit-name"
            />
            {errorMessage.name && (
              <span className="login-error">{errorMessage.name}</span>
            )}
          </div>
          <div className="edit-cabin-wrapper">
            <label className="edit-cabin-label" htmlFor="edit-address">
              Adresse
            </label>
            <input
              className="edit-cabin-input"
              defaultValue={cabin.length !== 0 ? cabin[0].address : ''}
              type="text"
              id="edit-address"
            />
            {errorMessage.address && (
              <span className="login-error">{errorMessage.address}</span>
            )}
          </div>
        </div>

        <div className="edit-cabin-2-2">
          <div className="edit-cabin-wrapper">
            <label className="edit-cabin-label" htmlFor="edit-latitude">
              Breddegrad
            </label>
            <input
              className="edit-cabin-input"
              defaultValue={
                cabin.length !== 0 ? cabin[0].coordinates.latitude : ''
              }
              type="text"
              id="edit-latitude"
            />
            {errorMessage.latitude && (
              <span className="login-error">{errorMessage.latitude}</span>
            )}
          </div>
          <div className="edit-cabin-wrapper">
            <label className="edit-cabin-label" htmlFor="edit-longitude">
              Lengdegrad
            </label>
            <input
              className="edit-cabin-input"
              defaultValue={
                cabin.length !== 0 ? cabin[0].coordinates.longitude : ''
              }
              type="text"
              id="edit-longitude"
            />
            {errorMessage.longitude && (
              <span className="login-error">{errorMessage.longitude}</span>
            )}
          </div>
        </div>

        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-directions">
            Veibeskrivelse
          </label>
          <textarea
            className="edit-cabin-input input-long"
            defaultValue={cabin.length !== 0 ? cabin[0].directions : ''}
            id="edit-directions"
          />
          {errorMessage.directions && (
            <span className="login-error">{errorMessage.directions}</span>
          )}
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-shortdesc">
            Kort beskrivelse
          </label>
          <textarea
            className="edit-cabin-input input-short"
            defaultValue={cabin.length !== 0 ? cabin[0].shortDescription : ''}
            id="edit-shortdesc"
          />
          {errorMessage.shortdesc && (
            <span className="login-error">{errorMessage.shortdesc}</span>
          )}
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-longdesc">
            Lang beskrivelse
          </label>
          <textarea
            className="edit-cabin-input input-long"
            defaultValue={cabin.length !== 0 ? cabin[0].longDescription : ''}
            id="edit-longdesc"
          />
          {errorMessage.longdesc && (
            <span className="login-error">{errorMessage.longdesc}</span>
          )}
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-recycling">
            Kildesortering info
          </label>
          <textarea
            className="edit-cabin-input input-long"
            defaultValue={
              cabin.length !== 0 ? cabin[0].other.kildesortering : ''
            }
            id="edit-recycling"
          />
          {errorMessage.recycling && (
            <span className="login-error">{errorMessage.recycling}</span>
          )}
        </div>
        <div className="edit-cabin-1-1-1">
          <div className="edit-cabin-wrapper">
            <label className="edit-cabin-label" htmlFor="edit-price">
              Pris
            </label>
            <input
              className="edit-cabin-input"
              defaultValue={cabin.length !== 0 ? cabin[0].price : ''}
              type="number"
              id="edit-price"
            />
            {errorMessage.price && (
              <span className="login-error">{errorMessage.price}</span>
            )}
          </div>
          <div className="edit-cabin-wrapper">
            <label className="edit-cabin-label" htmlFor="edit-cleaningprice">
              Vaskepris
            </label>
            <input
              className="edit-cabin-input"
              defaultValue={cabin.length !== 0 ? cabin[0].cleaningPrice : ''}
              type="number"
              id="edit-cleaningprice"
            />
            {errorMessage.cleaningprice && (
              <span className="login-error">{errorMessage.cleaningprice}</span>
            )}
          </div>
          {cabin.length !== 0
            ? Object.entries(cabin[0].features).map(([key, value]) => {
                if (typeof value == 'number') {
                  return (
                    <div className="edit-cabin-wrapper" key={key}>
                      <label
                        className="edit-cabin-label2"
                        htmlFor={'edit-' + key}
                      >
                        {key}
                      </label>
                      <input
                        className="edit-cabin-input"
                        defaultValue={value}
                        type="number"
                        id={'edit-' + key}
                      />
                      {errorMessage.numbers && (
                        <span className="login-error">
                          {errorMessage.numbers}
                        </span>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="input-function" key={key}>
                      <label className="edit-cabin-label2" htmlFor={key}>
                        {key}
                      </label>
                      <input
                        className="edit-cabin-checkbox"
                        type="checkbox"
                        id={key}
                        name={key}
                        defaultChecked={value}
                      />
                    </div>
                  );
                }
              })
            : null}
          {cabin.length !== 0 && typeof cabin[0].features.other !== 'undefined'
            ? Object.entries(cabin[0].features.other).map(([key, value]) => {
                return (
                  <div className="input-function" key={key}>
                    <label className="edit-cabin-label2" htmlFor={key}>
                      {key}
                    </label>
                    <input
                      className="edit-cabin-checkbox"
                      type="checkbox"
                      id={key}
                      name={key}
                      defaultChecked={value.toString()}
                    />
                  </div>
                );
              })
            : null}
        </div>

        <div className="edit-cabin-cbwrapper">
          <label className="edit-cabin-label" htmlFor="edit-active">
            Kan søkes på
          </label>
          <input
            className="edit-cabin-checkbox"
            type="checkbox"
            id="edit-active"
            defaultChecked={cabin.length !== 0 ? cabin[0].active : null}
          />
        </div>
        <div className="edit-cabin-wrapper" id="todolist">
          <label className="edit-cabin-label">Huskeliste</label>
          {cabin.length !== 0
            ? cabin[0].other.huskeliste.map((item, index) => {
                return (
                  <input
                    key={index}
                    id={item}
                    type="text"
                    defaultValue={item}
                    className="edit-cabin-input"
                  />
                );
              })
            : null}
        </div>
        <div className="add-remove-item">
          <IoMdAddCircle onClick={handleAddItem} />
          <IoIosRemoveCircle onClick={removeItem} />
        </div>

        <div className="add-cabin-wrapper">
          <label className="add-cabin-label">Endre hovedbildet til hytte</label>
          <input
            className="upload-input"
            type="file"
            id="mainPictureEndre"
            name="mainPictureEndre"
            accept=".jpg,.png"
          />
        </div>

        <button className="btn big" onClick={handleVisibility}>
          Endre
        </button>
      </div>
      {visible && (
        <AlertPopup
          title={'Lagring av hytte'}
          description={
            'Er du sikker på at du vil endre hytten? Hvis du svarer ja vil ' +
            document.getElementById('edit-name').value +
            ' endres!'
          }
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={handleEdit}
        />
      )}
      {errorVisible && (
        <InfoPopup
          btnText="Ok"
          hideMethod={handleErrorVisibility}
          title="Feil med endring av hytte"
          description={
            "Hytten ble ikke endret. Server svarte med: '" + error + "'."
          }
        />
      )}
      {saved && (
        <AlertPopup
          title="Hytte endret!"
          description="Hytten ble endret og lagret i databasen! Vil du bli sendt til oversikten over hytter?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleSavedVisibility}
          acceptMethod={() => {
            setSaved(false);
            window.location.href = '/admin/endrehytter';
          }}
        />
      )}
    </>
  );
};

export default EditCabin;
