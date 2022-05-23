import { useState, useEffect } from 'react';
import './FAQ.css';
//import LoginContext from '../../LoginContext/login-context';
import FAQ_QUESTION from '../01-Reusable/FAQ_Question/FAQ_Question';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';

const FAQ = () => {
  //const loginContext = useContext(LoginContext);
  //const loggedIn = loginContext.loggedIn;
  const [FAQElements, setFAQElements] = useState([]);

  //Fetching
  useEffect(() => {
    async function fetchData() {
      fetch('/api/faq/all')
        .then((response) => response.json())
        .then((data) => setFAQElements(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  //If you press one of the questions the one that is already open will close
  const toggleFAQ = (index) => {
    setFAQElements(
      FAQElements.map((FAQ, i) => {
        if (i === index) {
          FAQ.open = !FAQ.open;
        }
        // closes the other questions
        /*else {
          FAQ.open = false;
        }*/
        return FAQ;
      })
    );
  };

  return (
    <>
      <HeroBanner name="faq" />
      <div className="FAQs">
        {FAQElements.length > 0 ? (
          FAQElements.map((faq, index) => (
            <FAQ_QUESTION
              key={index}
              faq={faq}
              index={index}
              toggleFAQ={(index) => toggleFAQ(index)}
            />
          ))
        ) : (
          <p className="faq-error">
            Det ser ut til å være tekniske problemer, eller så har ingen FAQ
            blitt opprettet enda.
          </p>
        )}
      </div>
    </>
  );
};

export default FAQ;
