import { useEffect, useState } from 'react';
import AlertPopup from '../PopUp/AlertPopup';
import './FeedbackForm.css';
import Question1 from './Questions/Question1';
import Question2 from './Questions/Question2';
import Question3 from './Questions/Question3';
import Question4 from './Questions/Question4';
import Question5 from './Questions/Question5';

const FeedbackForm = (props) => {
  const [question, setQuestion] = useState(1);
  const [replyVisibility, setReplyVisibility] = useState();
  const [yesReplied, setYesReplied] = useState(false);
  const [noReplied, setNoReplied] = useState(false);
  const [errors, setErrors] = useState({});
  const [q1Value, setQ1Value] = useState('');
  const [q2Value, setQ2Value] = useState('');
  const [q3Value, setQ3Value] = useState('');
  const [q4Value, setQ4Value] = useState('');
  const [q5Value, setQ5Value] = useState('');
  const [answers, setAnswers] = useState([]);
  const [visible, setVisible] = useState(false);

  console.log(props.data);

  const handleVisibility = () => {
    setVisible(!visible);
  };

  const nextQuestion = () => {
    let _errors = {};
    if (!yesReplied && !noReplied) {
      _errors.replied = 'Du må velge ja eller nei!';
    }

    if (
      document.getElementById('nobtn').checked &&
      document.getElementById('reply-value').value === ''
    ) {
      _errors.written = 'Du må skrive noe hvis du velger nei!';
    }

    setErrors(_errors);

    if (_errors.replied || _errors.written) {
      return;
    }

    if (question < 5) {
      if (question === 1) {
        if (yesReplied) {
          setQ1Value('');
        } else {
          setQ1Value(document.getElementById('reply-value').value);
        }

        document.getElementById('reply-value').value = q2Value;
      } else if (question === 2) {
        if (yesReplied) {
          setQ2Value('');
        } else {
          setQ2Value(document.getElementById('reply-value').value);
        }

        document.getElementById('reply-value').value = q3Value;
      } else if (question === 3) {
        if (yesReplied) {
          setQ3Value('');
        } else {
          setQ3Value(document.getElementById('reply-value').value);
        }

        document.getElementById('reply-value').value = q4Value;
      } else if (question === 4) {
        if (yesReplied) {
          setQ4Value('');
        } else {
          setQ4Value(document.getElementById('reply-value').value);
        }

        document.getElementById('reply-value').value = q5Value;
      }
      setQuestion(question + 1);
    }

    if (question === 5) {
      if (yesReplied) {
        setQ5Value('');
        document.getElementById('reply-value').value = '';
      } else {
        setQ5Value(document.getElementById('reply-value').value);
      }

      let _answers = [
        q1Value,
        q2Value,
        q3Value,
        q4Value,
        document.getElementById('reply-value').value,
      ];

      setAnswers(_answers);
    }

    document.getElementById('nobtn').checked = false;
    document.getElementById('yesbtn').checked = false;

    setReplyVisibility(false);
    setYesReplied(false);
    setNoReplied(false);
  };

  const prevQuestion = () => {
    setErrors({});
    if (question !== 1) {
      if (question === 2) {
        document.getElementById('reply-value').value = q1Value;
      } else if (question === 3) {
        document.getElementById('reply-value').value = q2Value;
      } else if (question === 4) {
        document.getElementById('reply-value').value = q3Value;
      } else if (question === 5) {
        document.getElementById('reply-value').value = q4Value;
      }
      setQuestion(question - 1);
    }
  };

  const showReply = () => {
    setNoReplied(true);
    setYesReplied(false);
    setErrors({});
    setReplyVisibility(true);
  };

  const removeReply = () => {
    setYesReplied(true);
    setNoReplied(false);
    setErrors({});
    setReplyVisibility(false);
  };

  const sendFeedback = async () => {
    const response = await fetch('/application/setfeedback', {
      method: 'PATCH',
      body: JSON.stringify(props.data.applicationId),
      headers: { token: localStorage.getItem('refresh_token') },
    });
    if (response.ok) {
      setVisible(false);
      alert('Tilbakemelding registrert!');
    }
  };

  const sendEmail = () => {
    if (answers.length > 0) {
      let email =
        'Bruker med navn ' +
        props.data.user.firstname +
        ' ' +
        props.data.user.lastname +
        ', og epost ' +
        props.data.user.email +
        ' svarte nei på noen spørsmål i tilbakemeldingsskjemaet. Nedenfor sees svarene.';
      email += '\n\nSpørsmål: Har du vippset 1200,- til vaskebyrået?';
      answers.forEach((answer, index) => {
        if (answer.length !== 0) {
          if (index === 0) {
            email += '\nSvar: ';
            email += answer + '\n';
          }
          if (index === 1) {
            email += '\nSpørsmål: Var alt ok da dere ankom hytten?';
            email += '\nSvar: ';
            email += answer + '\n';
          }
          if (index === 2) {
            email +=
              '\nSpørsmål: Var alt ok da dere forlat hytten? (Ble noe ødelagt?)';
            email += '\nSvar: ';
            email += answer + '\n';
          }
          if (index === 3) {
            email +=
              '\nSpørsmål: Har hytten alt av forsyning (toalettpapir, ved, lyspærer, rengjøringsmiddel)?';
            email += '\nSvar: ';
            email += answer + '\n';
          }
          if (index === 4) {
            email += '\nSpørsmål: Alt ellers greit?';
            email += '\nSvar: ';
            email += answer + '\n';
          }
        }
      });
      console.log(email);
    }
  };

  useEffect(() => {
    if (answers.length > 0) {
      let feedbackSent = false;
      answers.forEach((answer) => {
        if (answer.length > 0) {
          feedbackSent = true;
        }
      });

      if (feedbackSent) {
        // Send an email to admin here
        setVisible(true);
      } else {
        setVisible(true);
      }
    }
  }, [answers]);

  return (
    <>
      <div className="feedback-container">
        <p onClick={sendEmail} className="feedback-title">
          Sjekkliste før du reiser hjem
        </p>
        <div className="feedback-form-container">
          {question === 1 && <Question1 />}
          {question === 2 && <Question2 />}
          {question === 3 && <Question3 />}
          {question === 4 && <Question4 />}
          {question === 5 && <Question5 />}

          <div className="question-buttons">
            <div className="feedback-yesno-container">
              <input
                id="yesbtn"
                className="answer-input"
                name="feedbackbtns"
                type="radio"
              />
              <label
                onClick={removeReply}
                htmlFor="yesbtn"
                className="yes-no-label"
              >
                Ja
              </label>
            </div>
            <div className="feedback-yesno-container">
              <input
                id="nobtn"
                name="feedbackbtns"
                className="answer-input"
                type="radio"
              />
              <label
                onClick={showReply}
                htmlFor="nobtn"
                className="yes-no-label"
              >
                Nei
              </label>
            </div>
          </div>
          <div className="textarea-error-container">
            <textarea
              placeholder="Skriv hvorfor her.."
              id="reply-value"
              className={replyVisibility ? 'question-reply' : 'no-reply'}
            />
            {errors.written && (
              <span className="login-error">{errors.written}</span>
            )}
          </div>

          <div className={question === 1 ? 'onebutton-form' : 'twobutton-form'}>
            {question === 1 ? null : (
              <button className="feedback-btn" onClick={prevQuestion}>
                Forrige
              </button>
            )}
            <button className="feedback-btn" onClick={nextQuestion}>
              {question === 5 ? 'Fullfør' : 'Neste'}
            </button>
          </div>
          {errors.replied && (
            <span className="login-error">{errors.replied}</span>
          )}
        </div>
      </div>
      {visible && (
        <AlertPopup
          title="Tilbakemelding"
          description="Er du sikker på at du vil sende inn tilbakemeldingskjemaet?"
          acceptMethod={sendFeedback}
          cancelMethod={handleVisibility}
          negativeAction="Avbryt"
          positiveAction="Ja"
        />
      )}
    </>
  );
};

export default FeedbackForm;
