import './EditCabin.css';

const EditCabin = (props) => {
  const link = window.location.href;

  const pageName = link.split('/')[4];
  return (
    <>
      <div className="edit-cabin-container">
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" for="edit-name">
            Navn
          </label>
          <input
            className="edit-cabin-input"
            value={pageName}
            type="text"
            id="edit-name"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" for="edit-address">
            Adresse
          </label>
          <input
            className="edit-cabin-input"
            value="Grøndalsvegen 764"
            type="text"
            id="edit-address"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" for="edit-bedrooms">
            Soverom
          </label>
          <input
            className="edit-cabin-input"
            value="4"
            type="number"
            id="edit-bedrooms"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" for="edit-sleeping">
            Sengeplasser
          </label>
          <input
            className="edit-cabin-input"
            value="8"
            type="number"
            id="edit-sleeping"
          />
        </div>
        <div className="edit-cabin-wrapper">
          <label className="edit-cabin-label" for="edit-baths">
            Bad
          </label>
          <input
            className="edit-cabin-input"
            value="1"
            type="number"
            id="edit-baths"
          />
        </div>
        <div className="edit-cabin-cbwrapper">
          <label className="edit-cabin-label" for="edit-wifi">
            Internett
          </label>
          <input
            className="edit-cabin-checkbox"
            type="checkbox"
            id="edit-wifi"
          />
        </div>
      </div>
    </>
  );
};

export default EditCabin;
