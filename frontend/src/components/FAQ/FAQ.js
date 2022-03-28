import { useContext, useState, useEffect } from 'react';
import './FAQ.css';
import LoginContext from '../../LoginContext/login-context';
import FAQ_Question from '../01-Reusable/FAQ_Question/FAQ_Question';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';

const FAQ = () => {
  const loginContext = useContext(LoginContext);
  const loggedIn = loginContext.loggedIn;

  const [FAQElements, setFAQElements] = useState([
    {
      question: 'I am a question',
      answer: 'i am an anwser',
      open: false,
    },
  ]);

  //Fetching
  useEffect(async () => {
    fetch('/faq/getall')
      .then((response) => response.json())
      .then((data) => setFAQElements(data))
      .catch((error) => console.log(error));
  }, []);

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
      <HeroBanner name="faq" />
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
