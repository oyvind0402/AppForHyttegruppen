import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './AddFAQ.css';

const AddFAQ = () => {
  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <HeroBanner name="Legg til ofte stilte spørsmål og svar" />
      <div className="add-faq-container">
        <div className="add-faq-wrapper">
          <label htmlFor="add-faq-label">Spørsmål</label>
          <input type="text" id="add-question" className="add-faq-input" />
        </div>
        <div className="add-faq-wrapper">
          <label htmlFor="add-faq-label">Svar</label>
          <input type="text" id="add-answer" className="add-faq-input" />
        </div>
        <button>Legg til</button>
      </div>
    </>
  );
};

export default AddFAQ;
