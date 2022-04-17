import { useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './AddFAQ.css';

const AddFAQ = () => {
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleVisibility = () => {
    let _errors = {};

    if (document.getElementById('add-question').value.length === 0) {
      _errors.question = 'Fyll inn spørsmålet!';
    }
    if (document.getElementById('add-answer').value.length === 0) {
      _errors.answer = 'Fyll inn svaret!';
    }

    setErrors(_errors);

    if (_errors.question || _errors.answer) {
      return;
    }

    setVisible(!visible);
  };

  const addQuestionAndAnswer = async () => {
    const question = document.getElementById('add-question').value;
    const answer = document.getElementById('add-answer').value;

    setVisible(false);
    if (question.length === 0 || answer.length === 0) {
      return;
    }

    const response = await fetch('/faq/post', {
      method: 'POST',
      headers: { token: localStorage.getItem('token') },
      body: JSON.stringify({
        question: question,
        answer: answer,
      }),
    });
    const data = response.json();
    if (response.ok) {
      console.log(data);
    }
  };

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <HeroBanner name="Legg til ofte stilte spørsmål og svar" />
      <div className="add-faq-container">
        <div className="add-faq-wrapper">
          <label className="add-faq-label">Spørsmål</label>
          <textarea
            id="add-question"
            placeholder="Skriv inn spørsmål.."
            className="add-faq-input"
          />
          {errors.question && (
            <span className="login-error">{errors.question}</span>
          )}
        </div>
        <div className="add-faq-wrapper">
          <label className="add-faq-label">Svar</label>
          <textarea
            id="add-answer"
            placeholder="Skriv inn svar.."
            className="add-faq-input2"
          />
          {errors.answer && (
            <span className="login-error">{errors.answer}</span>
          )}
        </div>
        <button onClick={handleVisibility} className="btn big">
          Lagre
        </button>
      </div>
      {visible && (
        <AlertPopup
          title={'Vil du lagre spørsmålet og svaret?'}
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={addQuestionAndAnswer}
          show={visible}
        />
      )}
    </>
  );
};

export default AddFAQ;
