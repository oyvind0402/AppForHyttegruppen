import { useEffect } from 'react';
import { FeatureIcon } from '../../01-Reusable/FeatureIcon/FeatureIcon';
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
  useEffect(() => {
    const grid = document.getElementById('features');
    if (grid !== null) {
      let maxWidth = 0.0;
      grid.childNodes.forEach((item) => {
        const computed = window
          .getComputedStyle(item, null)
          .getPropertyValue('width');
        const reg = /[0-9.]*/;
        const width = Number(reg.exec(computed)[0]);
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      grid.childNodes.forEach((item) => {
        item.style.width = maxWidth + 'px';
      });
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="features" id="features">
        {props.cabinData !== null &&
          typeof props.cabinData !== undefined &&
          typeof props.cabinData.features !== undefined &&
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
    </div>
  );
};

const Feat = (props) => {
  return (
    <div className="features-item">
      <FeatureIcon
        feature={props.k}
        bool={typeof props.val === 'boolean' ? props.val : undefined}
      />
      <p>
        {typeof props.val === 'boolean'
          ? props.val
            ? props.k.replace(/^\w/, (char) => char.toUpperCase())
            : 'Ikke ' + props.k
          : props.val + ' ' + props.k}
      </p>
    </div>
  );
};

export default Features;
