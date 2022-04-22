import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditFAQ.css';

const EditFAQ = () => {
  const history = useHistory();
  const [FAQ, setFAQ] = useState({});
  const [editing, setEditing] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const [errors, setErrors] = useState({});

  const handleVisibility = () => {
    let _errors = {};

    if (document.getElementById('edit-faq-question').value.length === 0) {
      _errors.question = 'Fyll inn spørsmålet!';
    }
    if (document.getElementById('edit-faq-answer').value.length === 0) {
      _errors.answer = 'Fyll inn svaret!';
    }

    setErrors(_errors);

    if (_errors.question || _errors.answer) {
      return;
    }

    setEditing(!editing);
  };

  const handleDeletionVisibility = () => {
    setDeletion(!deletion);
  };

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

    const response = await fetch('/faq/update', {
      method: 'PUT',
      body: JSON.stringify(_FAQ),
      headers: { token: localStorage.getItem('refresh_token') },
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      history.replace('/admin/endrefaqs');
    }
  };

  const deleteFAQ = async (id) => {
    setEditing(false);

    const response = await fetch('/faq/delete', {
      method: 'DELETE',
      headers: { token: localStorage.getItem('refresh_token') },
      body: JSON.stringify(id),
    });
    if (response.ok) {
      history.replace('/admin/endrefaqs');
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
          {errors.question && (
            <span className="login-error">{errors.question}</span>
          )}
          <label className="faq-title">Svar</label>
          <textarea
            className="faq-area"
            id="edit-faq-answer"
            defaultValue={typeof FAQ !== 'undefined' ? FAQ.answer : null}
          />
          {errors.answer && (
            <span className="login-error">{errors.answer}</span>
          )}
          <div className="editfaq-buttons">
            <button onClick={handleVisibility} className="btn-smaller">
              Endre
            </button>
            <button onClick={handleDeletionVisibility} className="btn-smaller">
              Slett
            </button>
          </div>
        </div>
      </div>
      {editing && (
        <AlertPopup
          title={'Endring av FAQ'}
          description="Vil du endre spørsmålet og svaret?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={editFAQ}
        />
      )}
      {deletion && (
        <AlertPopup
          title={'Sletting av FAQ'}
          description="Vil du slette spørsmålet og svaret?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleDeletionVisibility}
          acceptMethod={() => deleteFAQ(FAQ.id)}
        />
      )}
    </>
  );
};

export default EditFAQ;
