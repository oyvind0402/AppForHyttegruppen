import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditFAQs.css';

const EditFAQs = () => {
  const [FAQs, setFAQs] = useState([]);
  const [visible, setVisible] = useState(false);

  const fetchFAQs = async () => {
    const response = await fetch('/faq/all');
    const data = await response.json();
    if (response.ok) {
      setFAQs(data);
    }
  };

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const deleteFAQ = async (id) => {
    setVisible(false);

    const response = await fetch('/faq/delete', {
      method: 'DELETE',
      headers: { token: localStorage.getItem('refresh_token') },
      body: JSON.stringify(id),
    });
    const data = await response.json();
    if (response.ok) {
      setFAQs(FAQs.filter((faq) => faq.id !== id));
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
                      <button
                        onClick={handleVisibility}
                        className="btn-smaller"
                      >
                        Slett
                      </button>
                    </div>
                  </div>
                  {visible && (
                    <AlertPopup
                      title="Er du sikker på at du vil slette FAQ'en?"
                      description="Hvis du trykker ja vil spørsmålet og svaret permanent bli slettet"
                      cancelMethod={handleVisibility}
                      acceptMethod={() => deleteFAQ(FAQ.id)}
                      negativeAction="Nei"
                      positiveAction="Ja"
                    />
                  )}
                </div>
              );
            })
          : null}
      </div>
    </>
  );
};

export default EditFAQs;
