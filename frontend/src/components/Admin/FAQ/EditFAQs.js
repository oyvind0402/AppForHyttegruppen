import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import './EditFAQs.css';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';

const EditFAQs = () => {
  const [FAQs, setFAQs] = useState([]);

  useEffect(() => {
    async function fetchFAQs() {
      fetch('/api/faq/all')
        .then((response) => response.json())
        .then((data) => {
          setFAQs(data);
        })
        .catch((error) => console.log(error));
    }
    fetchFAQs();
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <AdminBanner name="Endre spørsmål og svar" />
      <div className="edit-faqs-container">
        {FAQs.length > 0 && FAQs !== null && typeof FAQs !== undefined
          ? FAQs.map((FAQ, index) => {
              return (
                <div className="faq-wrapper" key={index}>
                  <div className="edit-faq-wrapper">
                    <label className="edit-faq-label">Spørsmål</label>
                    <p className="edit-faq-question">
                      {FAQ.question && FAQ.question}
                    </p>
                  </div>
                  <div className="edit-faq-wrapper">
                    <label className="edit-faq-label">Svar</label>
                    <p className="edit-faq-answer">
                      {FAQ.answer && FAQ.answer}
                    </p>
                  </div>
                  <div className="edit-button">
                    <div>
                      <Link
                        to={'/admin/endrefaq/' + FAQ.id}
                        className="link-white btn-smaller"
                      >
                        Endre
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
        <BsFillPlusCircleFill
          aria-label="Add a new FAQ"
          role="button"
          className="endrefaq-add"
          onClick={() => (window.location.href = '/admin/leggtilfaq')}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              window.location.href = '/admin/leggtilfaq';
            }
          }}
        />
      </div>
    </>
  );
};

export default EditFAQs;
