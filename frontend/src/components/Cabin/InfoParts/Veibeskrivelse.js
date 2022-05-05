import TabTextAndAddress from './TabTextAndAddress';

const UtvidetInfo = (props) => {
  return (
    <TabTextAndAddress
      cabinData={
        props.cabinData !== null &&
        typeof props.cabinData !== undefined &&
        props.cabinData
      }
      chosenText={
        props.cabinData.directions !== null &&
        typeof props.cabinData.directions !== undefined &&
        props.cabinData.directions
      }
    />
  );
};

export default UtvidetInfo;
