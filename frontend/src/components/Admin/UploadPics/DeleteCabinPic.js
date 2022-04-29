import { useEffect, useLayoutEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import CarouselFromProps from '../../01-Reusable/ImageCarousel/CarouselFromProps';
import './UploadCabinPic.css';
import './DeleteCabinPic.css';

const DeleteCabinPic = () => {
  const [cabinData, setCabinData] = useState('');
  const link = window.location.href;
  const pageID = link.split('/');

  useEffect(() => {
    async function getCabin(pageId) {
      console.log(pageId);
      fetch(`/cabin/${pageId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => setCabinData(data))
        .catch((error) => console.log(error));
    }
    getCabin(pageID[pageID.length - 1]);
  }, []);
  console.log(cabinData);

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
    const checkedCheckboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    //Offset by one since the
    for (let i = 0; i < checkedCheckboxes.length; i++) {
      console.log(cabinData.pictures.otherPictures[i + 1]);
      //Remove each picture at the time
    }
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
                      className="delete-picture-element"
                      onClick={(e) => checkCheckBox(e)}
                    >
                      <input
                        type="checkbox"
                        className="edit-cabin-checkbox"
                        name="delete-picture"
                      ></input>
                      <img
                        key={index}
                        src={`${process.env.PUBLIC_URL}/assets/pictures/${element.filename}`}
                        alt={element.altText}
                      />
                    </div>
                  );
                }
              })}
          </div>

          <button onClick={deleteChosenPictures} className="btn big">
            Fjern valgte bilder
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteCabinPic;
