import { useContext, useState } from 'react';

import LoginContext from '../../LoginContext/login-context';
import FAQ_Question from '../Reusable/FAQ_Question/FAQ_Question';

const FAQ = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;

  const [FAQElements, setFAQElements] = useState([
    {
      question: 'I am a question',
      anwser: 'i am an anwser',
      open: false,
    },
    {
      question: 'I am also a question',
      anwser: 'i am also an anwser',
      open: false,
    },
  ]);

  //If you press one of the questions the one that is already open will close
  const toggleFAQ = (index) => {
    setFAQElements(
      FAQElements.map((FAQ, i) => {
        if (i === index) {
          FAQ.open = !FAQ.open;
        } else {
          FAQ.open = false;
        }
        return FAQ;
      })
    );
  };

  return (
    <>
      <h1>FAQ info :D</h1>
      <div className="FAQs">
        {FAQElements.map((faq, index) => (
          <FAQ_Question
            key={index}
            faq={faq}
            index={index}
            toggleFAQ={(index) => toggleFAQ(index)}
          />
        ))}
      </div>
    </>
  );
};

export default FAQ;
