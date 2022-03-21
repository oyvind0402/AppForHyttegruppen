import './Step2.css';

const Period = (props) => {
  return (
    <>
      <div>
        <input
          className="soknad-step2-checkbox"
          type="checkbox"
          id={props.index}
          name={props.index}
        />
        <label className="soknad-step2-label" for={props.index}>
          Start: {props.period.Start} End: {props.period.End}
        </label>
      </div>
    </>
  );
};

export default Period;
