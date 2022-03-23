import { useEffect, useState } from 'react';
import './FeedbackForm.css';
import Question1 from './Questions/Question1';
import Question2 from './Questions/Question2';
import Question3 from './Questions/Question3';
import Question4 from './Questions/Question4';
import Question5 from './Questions/Question5';

const FeedbackForm = () => {
  const [question, setQuestion] = useState(1);
  const [replyVisibility, setReplyVisibility] = useState();
  const [replied, setReplied] = useState(false);
  const [q1Value, setQ1Value] = useState('No answer');
  const [q2Value, setQ2Value] = useState('No answer');
  const [q3Value, setQ3Value] = useState('No answer');
  const [q4Value, setQ4Value] = useState('No answer');
  const [q5Value, setQ5Value] = useState('No answer');

  const nextQuestion = () => {
    if (!replied) {
      alert('Du har ikke svart ja eller nei!');
      return;
    }
    if (question < 5) {
      if (question == 1) {
        setQ1Value(document.getElementById('reply-value').value);
        localStorage.setItem(
          'q1Value',
          document.getElementById('reply-value').value
        );
      } else if (question == 2) {
        setQ2Value(document.getElementById('reply-value').value);
      } else if (question == 3) {
        setQ3Value(document.getElementById('reply-value').value);
      } else if (question == 4) {
        setQ4Value(document.getElementById('reply-value').value);
      }
      setQuestion(question + 1);
    }

    if (question == 5) {
      setQ5Value(document.getElementById('reply-value').value);
    }
    document.getElementById('q1yesbtn').style.backgroundColor = '#bd00ff';
    document.getElementById('q1yesbtn').style.color = 'white';
    document.getElementById('q1nobtn').style.backgroundColor = '#bd00ff';
    document.getElementById('q1nobtn').style.color = 'white';
    document.getElementById('reply-value').value = '';
    setReplyVisibility(false);
    setReplied(false);
  };

  const prevQuestion = () => {
    if (question !== 1) {
      if (question == 2) {
        document.getElementById('reply-value').value = q1Value;
      } else if (question == 3) {
        document.getElementById('reply-value').value = q2Value;
      } else if (question == 4) {
        document.getElementById('reply-value').value = q3Value;
      } else if (question == 5) {
        document.getElementById('reply-value').value = q4Value;
      }
      setQuestion(question - 1);
    }
  };

  const showReply = () => {
    setReplied(true);
    setReplyVisibility(true);
    document.getElementById('q1yesbtn').style.backgroundColor = '#bd00ff';
    document.getElementById('q1yesbtn').style.color = 'white';
    document.getElementById('q1nobtn').style.backgroundColor = '#eaddff';
    document.getElementById('q1nobtn').style.color = 'black';
  };

  const removeReply = () => {
    setReplied(true);
    setReplyVisibility(false);
    document.getElementById('q1yesbtn').style.backgroundColor = '#eaddff';
    document.getElementById('q1yesbtn').style.color = 'black';
    document.getElementById('q1nobtn').style.backgroundColor = '#bd00ff';
    document.getElementById('q1nobtn').style.color = 'white';
  };

  useEffect(() => {
    if (q5Value !== 'No answer') {
      alert(
        'You answered: \n' +
          'Answer 1: ' +
          q1Value +
          '\n' +
          'Answer 2: ' +
          q2Value +
          '\n' +
          'Answer 3: ' +
          q3Value +
          '\n' +
          'Answer 4: ' +
          q4Value +
          '\n' +
          'Answer 5: ' +
          q5Value
      );
    }
  }, [q5Value]);

  return (
    <>
      <div className="feedback-container">
        <p className="feedback-title">Sjekkliste før du reiser hjem</p>
        <div className="feedback-form-container">
          {question == 1 && <Question1 />}
          {question == 2 && <Question2 />}
          {question == 3 && <Question3 />}
          {question == 4 && <Question4 />}
          {question == 5 && <Question5 />}

          <div className="question-buttons">
            <button onClick={removeReply} id="q1yesbtn" className="btn small">
              Ja
            </button>
            <button onClick={showReply} id="q1nobtn" className="btn small">
              Nei
            </button>
          </div>
          <textarea
            placeholder="Skriv hvorfor her.."
            id="reply-value"
            className={replyVisibility ? 'question-reply' : 'no-reply'}
          />
          <div className={question == 1 ? 'onebutton-form' : 'twobutton-form'}>
            {question == 1 ? null : (
              <button className="btn small" onClick={prevQuestion}>
                Forrige
              </button>
            )}
            <button className="btn small" onClick={nextQuestion}>
              {question == 5 ? 'Fullfør' : 'Neste'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
