import TabTextAndAddress from './TabTextAndAddress';

const UtvidetInfo = (props) => {
  return (
    <TabTextAndAddress
      cabinData={props.cabinData}
      chosenText={props.cabinData.longDescription}
    />
  );
};

export default UtvidetInfo;
