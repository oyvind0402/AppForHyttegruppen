import React from 'react';
import {
  BiBath,
  BiBed,
  BiWifi,
  BiWifiOff,
  BiXCircle,
  BiCheckCircle,
} from 'react-icons/bi';
import { GiBroom } from 'react-icons/gi';
import { MdOutlineBedroomParent, MdAttachMoney } from 'react-icons/md';
import { GrMoney, GrLocation } from 'react-icons/gr';
import './FeatureIcon.css';

const getIcon = (feature, bool) => {
  switch (feature) {
    case 'soverom':
      return <MdOutlineBedroomParent className="feature-icon-svg bedroom" />;
    case 'sengeplasser':
      return <BiBed className="feature-icon-svg icon-bed" />;
    case 'bad':
      return <BiBath className="feature-icon-svg icon-bath" />;
    case 'wifi':
      return bool ? (
        <BiWifi className="feature-icon-svg icon-wifi" />
      ) : (
        <BiWifiOff className="feature-icon-svg icon-nowifi" />
      );
    case 'price':
      return <GrMoney className="feature-icon-svg icon-price" />;
    case 'cleaningPrice':
      return <GiBroom className="feature-icon-svg icon-cleaningPrice" />;
    case 'totalPrice':
      return <MdAttachMoney className="feature-icon-svg icon-totalPrice" />;
    case 'address':
      return <GrLocation className="feature-icon-svg icon-address" />;
    default:
      return bool !== undefined && Boolean(bool) === false ? (
        <BiXCircle className="feature-icon-svg icon-other-false" />
      ) : (
        <BiCheckCircle className="feature-icon-svg icon-other" />
      );
  }
};

export const FeatureIcon = (props) => {
  return (
    <div className="feature-icon">{getIcon(props.feature, props.bool)}</div>
  );
};
