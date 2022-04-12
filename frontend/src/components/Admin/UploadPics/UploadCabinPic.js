import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './UploadCabinPic.css';

const UploadCabinPic = () => {
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
          className="upload-input"
          type="file"
          id="image"
          name="image"
          accept=".jpg,.png"
        />

        <button onClick={handleImageUpload} className="btn big">
          Last opp bilde
        </button>
      </div>
    </>
  );
};

export default UploadCabinPic;
