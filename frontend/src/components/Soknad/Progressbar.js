import './Progressbar.css';

const Progressbar = (props) => {
  let step1;
  let step2;
  let step3;

  if (props.page === 1) {
    step1 = (
      <button id="step1" className="progress-step activeProgress">
        1. Info
      </button>
    );
    step2 = (
      <button id="step2" className="progress-step not-activeProgress">
        2. Perioder
      </button>
    );
    step3 = (
      <button id="step3" className="progress-step not-activeProgress">
        3. Hytter
      </button>
    );
  } else if (props.page === 2) {
    step1 = (
      <button
        id="step1"
        className="progress-step passedProgress"
        onClick={() => props.clickOnProgressbar(1)}
      >
        1. Info
      </button>
    );
    step2 = (
      <button id="step2" className="progress-step activeProgress">
        2. Perioder
      </button>
    );
    step3 = (
      <button id="step3" className="progress-step not-activeProgress">
        3. Hytter
      </button>
    );
  } else {
    step1 = (
      <button
        id="step1"
        className="progress-step passedProgress"
        onClick={() => props.clickOnProgressbar(1)}
      >
        1. Info
      </button>
    );
    step2 = (
      <button
        id="step2"
        className="progress-step passedProgress"
        onClick={() => props.clickOnProgressbar(2)}
      >
        2. Perioder
      </button>
    );
    step3 = (
      <button id="step3" className="progress-step activeProgress">
        3. Hytter
      </button>
    );
  }

  return (
    <>
      <div className="progressbar">
        {step1}
        <hr className="progress-line" />
        {step2}
        <hr className="progress-line" />
        {step3}
      </div>
    </>
  );
};

export default Progressbar;
