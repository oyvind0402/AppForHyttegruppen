import { BiBath } from 'react-icons/bi';
import './Features.css';

const flatten = (obj) => {
  let res = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const nested = flatten(obj[key]);
      for (const nestedKey in nested) {
        res[nestedKey] = nested[nestedKey];
      }
    } else {
      res[key] = obj[key];
    }
  }
  return res;
};

const Features = (props) => {
  return (
    <div className="features">
      {typeof cabinData !== null &&
        props.cabinData.features !== undefined &&
        Object.keys(props.cabinData.features).map((key) => {
          const val = props.cabinData.features[key];
          if (typeof val != 'object') {
            return <Feat k={key} val={val} key={key} />;
          } else {
            const obj = flatten(val);
            return Object.keys(obj).map((key) => (
              <Feat k={key} val={obj[key]} key={key} />
            ));
          }
        })}
    </div>
  );
};

const Feat = (props) => {
  return (
    <div className="features-item">
      <div>
        <BiBath className="card-icon bath" />
      </div>
      <p>
        {typeof props.val === 'boolean'
          ? props.val
            ? props.k
            : ''
          : props.val + ' ' + props.k}
      </p>
    </div>
  );
};

export default Features;
