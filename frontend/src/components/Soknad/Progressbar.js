import { useContext, useEffect, useState } from 'react';
import './Progressbar.css';

const Progressbar = (props) => {
  let step1;
  let step2;
  let step3;

  if (props.page === 1) {
    step1 = (
      <p id="step1" className="progress-step activeProgress">
        1. Info
      </p>
    );
    step2 = (
      <p id="step2" className="progress-step not-activeProgress">
        2. Perioder
      </p>
    );
    step3 = (
      <p id="step3" className="progress-step not-activeProgress">
        3. Hytter
      </p>
    );
  } else if (props.page === 2) {
    step1 = (
      <p
        id="step1"
        className="progress-step passedProgress"
        onClick={() => props.clickOnProgressbar(1)}
      >
        1. Info
      </p>
    );
    step2 = (
      <p id="step2" className="progress-step activeProgress">
        2. Perioder
      </p>
    );
    step3 = (
      <p id="step3" className="progress-step not-activeProgress">
        3. Hytter
      </p>
    );
  } else {
    step1 = (
      <p
        id="step1"
        className="progress-step passedProgress"
        onClick={() => props.clickOnProgressbar(1)}
      >
        1. Info
      </p>
    );
    step2 = (
      <p
        id="step2"
        className="progress-step passedProgress"
        onClick={() => props.clickOnProgressbar(2)}
      >
        2. Perioder
      </p>
    );
    step3 = (
      <p id="step3" className="progress-step activeProgress">
        3. Hytter
      </p>
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
