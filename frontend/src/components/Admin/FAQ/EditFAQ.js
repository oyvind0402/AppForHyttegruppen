import { useEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import './EditFAQ.css';

const EditFAQ = () => {
  const [FAQ, setFAQ] = useState({});

  const link = window.location.href;
  let id = link.split('/')[5];

  const fetchFAQ = async () => {
    const response = await fetch('/faq/' + id);
    const data = await response.json();
    if (response.ok) {
      setFAQ(data);
    }
  };

  const editFAQ = async () => {
    const _FAQ = {
      id: parseInt(id),
      question: document.getElementById('edit-faq-question').value,
      answer: document.getElementById('edit-faq-answer').value,
    };

    console.log(_FAQ);
    const response = await fetch('/faq/update', {
      method: 'PUT',
      body: JSON.stringify(_FAQ),
      headers: { token: localStorage.getItem('token') },
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  return (
    <>
      <BackButton
        name="Tilbake til endre spørsmål og svar"
        link="admin/endrefaqs"
      />
      <HeroBanner name="Endre FAQ" />
      <div className="edit-faq-container">
        <div className="edit-faq-box">
          <label className="faq-title">Spørsmål</label>
          <textarea
            className="faq-input"
            id="edit-faq-question"
            defaultValue={typeof FAQ !== 'undefined' ? FAQ.question : null}
          />
          <label className="faq-title">Svar</label>
          <textarea
            className="faq-area"
            id="edit-faq-answer"
            defaultValue={typeof FAQ !== 'undefined' ? FAQ.answer : null}
          />
          <button onClick={editFAQ} className="btn big">
            Endre
          </button>
        </div>
      </div>
    </>
  );
};

export default EditFAQ;
