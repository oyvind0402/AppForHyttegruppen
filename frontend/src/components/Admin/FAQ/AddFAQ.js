import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './AddFAQ.css';

const AddFAQ = () => {
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const history = useHistory();

  const handleSaved = () => {
    setSaved(!saved);
  };

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

  const cookies = new Cookies();

  const addQuestionAndAnswer = async () => {
    const question = document.getElementById('add-question').value;
    const answer = document.getElementById('add-answer').value;
    document.getElementById('add-question').value = '';
    document.getElementById('add-answer').value = '';

    setVisible(false);
    if (question.length === 0 || answer.length === 0) {
      return;
    }

    try {
      const response = await fetch('/api/faq/post', {
        method: 'POST',
        headers: { token: cookies.get('token') },
        body: JSON.stringify({
          question: question,
          answer: answer,
        }),
      });
      if (response.ok) {
        setSaved(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <BackButton name="Tilbake til endre FAQ" link="admin/endrefaqs" />
      <AdminBanner name="Legg til FAQ" />
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
          title={'Lagring av FAQ'}
          description="Vil du lagre spørsmålet og svaret?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={addQuestionAndAnswer}
          show={visible}
        />
      )}
      {saved && (
        <AlertPopup
          title={'FAQ lagret!'}
          description="Spørsmålet og svaret har blitt lagret. Vil du bli sendt til oversikten over FAQ?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleSaved}
          acceptMethod={() => {
            setSaved(false);
            history.push('/admin/endrefaqs');
          }}
          show={visible}
        />
      )}
    </>
  );
};

export default AddFAQ;
