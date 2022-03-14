import { useState } from 'react';
import './FAQ_Question.css';

const FAQ_Question = (props) => {
  return (
    <>
      <div
        className={'FAQ ' + (props.faq.open ? 'open' : 'closed')}
        onClick={() => props.toggleFAQ(props.index)}
      >
        <div className="FAQ-question">{props.faq.question}</div>
        <div className="FAQ-answer">{props.faq.anwser}</div>
      </div>
    </>
  );
};

export default FAQ_Question;
