import { useEffect, useLayoutEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import CarouselFromProps from '../../01-Reusable/ImageCarousel/CarouselFromProps';
import './UploadCabinPic.css';
import './DeleteCabinPic.css';

const DeleteCabinPic = () => {
  const [cabinData, setCabinData] = useState('');
  const [value, setValue] = useState(0); // integer state

  const link = window.location.href;
  const pageID = link.split('/');

  useEffect(() => {
    async function getCabin(pageId) {
      fetch(`/cabin/${pageId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => setCabinData(data))
        .catch((error) => console.log(error));
    }
    getCabin(pageID[pageID.length - 1]);
  }, [value]);

  const checkCheckBox = (e) => {
    if (e.target.tagName.toUpperCase() === 'INPUT') {
      return;
    }
    if (e.target.tagName.toUpperCase() === 'IMG') {
      e.target.parentElement.childNodes[0].checked =
        !e.target.parentElement.childNodes[0].checked;
      return;
    }
    if (e.target.childNodes[0].tagName.toUpperCase() === 'INPUT') {
      e.target.childNodes[0].checked = !e.target.childNodes[0].checked;
    }
  };

  const deleteChosenPictures = () => {
    const deletePicture = document.querySelectorAll(
      'input[type=radio]:checked'
    );
    console.log(deletePicture[0].value);
    const formData = new FormData();
    formData.append('file', deletePicture[0].value);
    formData.append('cabinName', cabinData.name);

    fetch('/pictures/deletepictures', {
      method: 'POST',
      body: formData,
      headers: {
        token: localStorage.getItem('refresh_token'),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setValue((value) => value + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <BackButton
        name="Tilbake til last opp bilder"
        link="admin/lastoppbilder"
      />
      <HeroBanner name={'Last opp bilder'} />
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
                      <input
                        type="radio"
                        className="edit-cabin-checkbox"
                        name="delete-picture"
                        value={element.filename}
                      ></input>
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/pictures/${element.filename}`}
                        alt={element.altText}
                      />
                    </div>
                  );
                }
              })}
          </div>

          <button onClick={deleteChosenPictures} className="btn big">
            Slett bilde
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteCabinPic;
