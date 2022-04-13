import { useEffect } from 'react';
import './Huskeliste.css';

const Huskeliste = (props) => {
  useEffect(() => {
    const grid = document.getElementById('huskeliste');
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

  return props.cabinData.other.huskeliste !== undefined ? (
    <div>
      <p>Det bør du ta med: </p>
      <ul className="huskeliste-items" id="huskeliste">
        {props.cabinData.other.huskeliste.map((item) => (
          <li className="huskeliste-item">{item}</li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Informasjon er dessverre ikke tilgjengelig.</p>
  );
};

export default Huskeliste;
