import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './EditFAQs.css';

const EditFAQs = () => {
  const [FAQs, setFAQs] = useState([]);

  const fetchFAQs = async () => {
    const response = await fetch('/faq/all');
    const data = await response.json();
    if (response.ok) {
      setFAQs(data);
    }
  };

  useEffect(() => {
    fetchFAQs();
    console.log(FAQs);
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <HeroBanner name="Endre spørsmål og svar" />
      <div className="edit-faqs-container">
        {FAQs
          ? FAQs.map((FAQ) => {
              return (
                <div className="faq-wrapper">
                  <div className="edit-faq-wrapper">
                    <label className="edit-faq-label">Spørsmål</label>
                    <p className="edit-faq-question">{FAQ.question}</p>
                  </div>
                  <div className="edit-faq-wrapper">
                    <label className="edit-faq-label">Svar</label>
                    <p className="edit-faq-answer">{FAQ.answer}</p>
                  </div>
                  <div className="edit-button">
                    <div>
                      <Link to={'/admin/endrefaq/' + FAQ.id} className="link">
                        <button className="btn-smaller">Endre</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export default EditFAQs;
