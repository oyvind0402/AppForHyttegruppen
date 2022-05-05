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
        props.cabinData !== null &&
        typeof props.cabinData !== undefined &&
        props.cabinData.longDescription
      }
    />
  );
};

export default UtvidetInfo;
