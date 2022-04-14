import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import { IoIosRemoveCircle, IoMdAddCircle } from 'react-icons/io';
import './AddCabin.css';

const AddCabin = () => {
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

  const addCabin = async () => {
    let inputliste = document
      .getElementById('todolist')
      .getElementsByTagName('input');
    let huskeliste = [];
    for (var x = 0; x < inputliste.length; x++) {
      huskeliste.push(inputliste[x].value);
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
      console.log(data);
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
    </>
  );
};

export default AddCabin;
