import { useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './UploadCabinPic.css';

const UploadCabinPic = () => {
  const [url, setUrl] = useState();
  const link = window.location.href;
  let cabinName = link.split('/')[5];
  if (cabinName.includes('%20') || cabinName.includes('%C3%B8')) {
    let fix = cabinName.replace('%20', ' ');
    cabinName = fix.replace('%C3%B8', 'ø');
  }

  const handleImageUpload = async () => {
    const files = document.getElementById('image').files[0];
    const formData = new FormData();
    formData.append('file', files);
    formData.append('cabinName', cabinName);
    console.log(files);
    setUrl(null);

    // fetch('/pictures/one', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
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
      <HeroBanner name={'Last opp bilder'} />
      <div className="upload-cabin-pic-container">
        <p className="upload-title">Last opp bilder for {cabinName}</p>
        <input
          onChange={(e) => handleChange(e)}
          className="upload-input"
          type="file"
          id="image"
          name="image"
          accept=".jpg,.png"
        />

        {url ? (
          <div>
            <p>Valgt bilde:</p>
            <img src={url} />
          </div>
        ) : null}

        <button onClick={handleImageUpload} className="btn big">
          Last opp bilde
        </button>
      </div>
    </>
  );
};

export default UploadCabinPic;
