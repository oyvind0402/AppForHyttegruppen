import React from 'react';
import TabButton from '../../01-Reusable/Buttons/TabButton';
import './TabPicker.css';

export const TabPicker = (props) => {
  const tabs = ['Egenskaper', 'Utvidet info', 'Huskeliste', 'Veibeskrivelse'];
  return (
    <div className="tabPicker">
      {tabs.map((val, index) => {
        return (
          <TabButton
            className={
              index === props.active
                ? 'tabpicker-tab activetab'
                : 'tabpicker-tab'
            }
            name={val}
            onClick={() => props.setInfoTab(index)}
            key={index}
          />
        );
      })}
    </div>
  );
};
