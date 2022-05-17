import { useEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import './UploadCabinPic.css';
import './DeleteCabinPic.css';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import Cookies from 'universal-cookie';

const DeleteCabinPic = () => {
  const [cabinData, setCabinData] = useState('');
  const [counter, setCounter] = useState(0);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function getCabin() {
    const link = window.location.href;
    const pageID = link.split('/');
    fetch(`/api/cabin/${pageID[pageID.length - 1]}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => setCabinData(data))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    if (cabinData === '') {
      getCabin();
    }
  });

  useEffect(() => {
    getCabin();
  }, [counter]);

  const checkCheckBox = (e) => {
    if (e.target.tagName.toUpperCase() === 'INPUT') {
      return;
    }
    if (e.target.tagName.toUpperCase() === 'IMG') {
      e.target.parentElement.childNodes[1].checked =
        !e.target.parentElement.childNodes[1].checked;
      return;
    }
    if (e.target.childNodes[1].tagName.toUpperCase() === 'INPUT') {
      e.target.childNodes[1].checked = !e.target.childNodes[0].checked;
    }
  };

  const cookies = new Cookies();

  const deleteChosenPictures = () => {
    setVisible(false);
    const deletePicture = document.querySelectorAll(
      'input[type=radio]:checked'
    );
    const formData = new FormData();
    formData.append('cabinName', cabinData.name);
    formData.append('file', deletePicture[0].value);

    fetch('/api/pictures/deletepictures', {
      method: 'POST',
      body: formData,
      headers: {
        token: cookies.get('token'),
      },
    })
      .then((response) => {
        if (response.ok) {
          setSaved(true);
        } else {
          setErrorMessage(
            'En feil har oppstått bildet ble ikke slettet men vil heller ikke være synlig lenger.'
          );
        }
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  const selectedPicture = () => {
    const deletePicture = document.querySelectorAll(
      'input[type=radio]:checked'
    );

    if (deletePicture.length > 0) {
      setVisible(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const handleErrorVisibility = () => {
    setErrorMessage('');
  };

  return (
    <>
      <BackButton name="Tilbake til slett bilder" link="admin/slettbilder" />
      <AdminBanner name={'Slett bilder'} />
      <div className="upload-cabin-pic-container">
        <div className="image-upload-wrapper">
          {cabinData !== '' && (
            <p className="upload-title">Slett bilder fra {cabinData.name}</p>
          )}
          <div className="delete-picture-list">
            {cabinData !== '' &&
              cabinData.pictures.otherPictures.map((element, index) => {
                if (index !== 0) {
                  return (
                    <div
                      key={index}
                      className="delete-picture-element"
                      onClick={(e) => checkCheckBox(e)}
                    >
                      <label htmlFor={index}>Slett</label>
                      <input
                        type="radio"
                        className="edit-cabin-checkbox"
                        name="delete-picture"
                        value={element.filename}
                        id={index}
                      ></input>
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/pictures/${element.filename}`}
                        alt={element.altText}
                      />
                    </div>
                  );
                }
                return null;
              })}
          </div>

          {error && <p className="login-error">Velg et bilde!</p>}
          <button onClick={selectedPicture} className="btn big">
            Slett bilde
          </button>

          {visible && (
            <AlertPopup
              title={'Slette bilde'}
              description={'Er du sikker på at du vil slette dette bildet?'}
              negativeAction="Nei"
              positiveAction="Ja"
              cancelMethod={handleVisibility}
              acceptMethod={deleteChosenPictures}
            />
          )}
          {errorMessage !== '' && (
            <InfoPopup
              btnText="Ok"
              hideMethod={handleErrorVisibility}
              title="Feil med sletting av bilde"
              description={errorMessage}
            />
          )}
          {saved && (
            <AlertPopup
              title="Bilde slettet!"
              description="Vil du slette flere bilder av hytta?"
              negativeAction="Nei"
              positiveAction="Ja"
              cancelMethod={() => {
                setSaved(false);
                window.location.href = '/admin';
              }}
              acceptMethod={() => {
                setSaved(false);
                setCounter((counter) => counter + 1);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DeleteCabinPic;
