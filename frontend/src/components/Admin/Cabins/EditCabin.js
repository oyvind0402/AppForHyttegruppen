import { useEffect, useState } from 'react';
import { IoIosRemoveCircle, IoMdAddCircle } from 'react-icons/io';
import { useHistory } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditCabin.css';

const EditCabin = () => {
  const [cabin, setCabin] = useState([]);
  const [visible, setVisible] = useState(false);
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

  const cancelPopup = () => {
    setVisible(false);
  };

  const acceptPopup = () => {
    setVisible(false);
    history.push('/admin/lastoppbilde/' + cabinName);
  };

  async function handleEdit() {
    let inputliste = document
      .getElementById('todolist')
      .getElementsByTagName('input');
    let huskeliste = [];
    for (var x = 0; x < inputliste.length; x++) {
      huskeliste.push(inputliste[x].value);
    }
    console.log(huskeliste);
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
    console.log(cabin2);

    const response = await fetch('/cabin/update', {
      method: 'PUT',
      body: JSON.stringify(cabin2),
      headers: { token: localStorage.getItem('token') },
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      setVisible(true);
    }
  }

  return (
    <>
      <BackButton name="Tilbake til endre hytter" link="admin/endrehytter" />
      <div className="edit-cabin-container">
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
        </div>
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
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-directions">
            Veibeskrivelse
          </label>
          <textarea
            className="edit-cabin-input-long"
            defaultValue={cabin.length !== 0 ? cabin[0].directions : ''}
            id="edit-directions"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-shortdesc">
            Kort beskrivelse
          </label>
          <textarea
            className="edit-cabin-input-short"
            defaultValue={cabin.length !== 0 ? cabin[0].shortDescription : ''}
            id="edit-shortdesc"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-longdesc">
            Lang beskrivelse
          </label>
          <textarea
            className="edit-cabin-input-long"
            defaultValue={cabin.length !== 0 ? cabin[0].longDescription : ''}
            id="edit-longdesc"
          />
        </div>
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
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" htmlFor="edit-recycling">
            Kildesortering info
          </label>
          <textarea
            className="edit-cabin-input-long"
            defaultValue={
              cabin.length !== 0 ? cabin[0].other.kildesortering : ''
            }
            id="edit-recycling"
          />
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

        <button className="btn big" onClick={handleEdit}>
          Endre
        </button>
      </div>
      {visible && (
        <AlertPopup
          title={'Vil du legge til bilder for ' + cabinName + '?'}
          description={
            cabinName +
            ' endret! Hvis du trykker ja kan du legge til bilder for ' +
            cabinName +
            '. Vil du det?'
          }
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={cancelPopup}
          acceptMethod={acceptPopup}
          show={visible}
        />
      )}
    </>
  );
};

export default EditCabin;
