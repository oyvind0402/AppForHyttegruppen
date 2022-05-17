import { useState } from 'react';
import Cookies from 'universal-cookie';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import CarouselFromProps from '../../01-Reusable/ImageCarousel/CarouselFromProps';
import './UploadCabinPic.css';

const UploadCabinPic = () => {
  const [url, setUrl] = useState();
  const [uploadedImages, setUploadedImages] = useState([]);
  const link = window.location.href;
  let cabinName = link.split('/')[5];
  if (cabinName.includes('%20') || cabinName.includes('%C3%B8')) {
    let fix = cabinName.replace('%20', ' ');
    cabinName = fix.replace('%C3%B8', 'ø');
  }

  const handleShowingPictures = (image) => {
    setUploadedImages((images) => [...images, { image }]);
  };

  const cookies = new Cookies();

  const handleImageUpload = async () => {
    const files = document.getElementById('image').files[0];
    console.log(files);
    const formData = new FormData();
    formData.append('cabinName', cabinName);
    formData.append('altText', files);
    formData.append('file', files);
    setUrl(null);

    if (typeof files === 'undefined') {
      return;
    }

    handleShowingPictures(files);

    fetch('/api/pictures/one', {
      method: 'POST',
      body: formData,
      headers: {
        token: cookies.get('token'),
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
    document.getElementById('image').value = null;
  };

  const handleChange = (event) => {
    if (event.target.files.length > 0) {
      setUrl(URL.createObjectURL(event.target.files[0]));
    } else {
      setUrl(null);
    }
  };
  return (
    <>
      <BackButton
        name="Tilbake til last opp bilder"
        link="admin/lastoppbilder"
      />
      <AdminBanner name={'Last opp bilder'} />
      <div className="upload-cabin-pic-container">
        <div className="image-upload-wrapper">
          <label className="upload-title" htmlFor="image">
            Last opp bilder for {cabinName}
          </label>
          <input
            onChange={(e) => handleChange(e)}
            className="upload-input"
            type="file"
            id="image"
            name="image"
            accept=".jpg,.png"
          />
        </div>

        {url ? (
          <div className="image-upload-wrapper">
            <div>
              <p>Valgt bilde:</p>
              <div className="chosen-image-center">
                <img className="chosen-image" src={url} alt={url} />
              </div>
            </div>
          </div>
        ) : null}
        <button onClick={handleImageUpload} className="btn big">
          Last opp bilde
        </button>
        {uploadedImages.length > 0 ? (
          <>
            <p className="uploaded-pics-title">Opplastede bilder:</p>
            <CarouselFromProps data={uploadedImages} />
          </>
        ) : null}
      </div>
    </>
  );
};

export default UploadCabinPic;
