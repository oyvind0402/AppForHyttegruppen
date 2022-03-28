import { useState } from 'react';
import './Questions.css';

const Question1 = (props) => {
  return (
    <>
      <div className="question-container">
        <p className="question-title">
          Før avreise må følgende spørsmål besvares:
        </p>
        <p className="question-text">Har du vippset 1200,- til vaskebyrået?</p>
      </div>
    </>
  );
};

export default Question1;