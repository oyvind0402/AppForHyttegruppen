import './FAQ_Question.css';

const FAQ_Question = (props) => {
  if (
    typeof props.faq === 'undefined' ||
    props.faq === null ||
    props.index === null ||
    typeof props.index === 'undefined' ||
    props.toggleFAQ === null ||
    typeof props.toggleFAQ === 'undefined'
  ) {
    return <></>;
  }
  return (
    <>
      <button
        className={'FAQ ' + (props.faq.open ? 'open' : 'closed')}
        onClick={() => props.toggleFAQ(props.index)}
      >
        <div className="FAQ-question">{props.faq.question}</div>
        <div className="FAQ-answer">{props.faq.answer}</div>
      </button>
    </>
  );
};

export default FAQ_Question;
