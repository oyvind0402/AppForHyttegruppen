import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

const ExcelConverter = () => {
  const [applicationData, setApplicationData] = useState('');
  const [tempApplicationData, setTempApplicationData] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      fetch('/application/all')
        .then((response) => response.json())
        .then((data) => setTempApplicationData(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (tempApplicationData !== '') {
      /* CONVERT THE DATA */
      const newApllicationData = [];
      for (let index in tempApplicationData) {
        let newApplication = {
          applicationId: tempApplicationData[index].applicationId,
          userId: tempApplicationData[index].userId,
          accentureId: tempApplicationData[index].accentureId,
          tripPurpose: tempApplicationData[index].tripPurpose,
          period: tempApplicationData[index].period.name,
          numberOfCabins: tempApplicationData[index].numberOfCabins,
          cabinAssignment: tempApplicationData[index].cabinAssignment,
          cabins: '',
          cabinsWon: '',
          winner: tempApplicationData[index].winner,
        };

        //Convert all requested cabins to one string
        let requestedCabins = '';
        for (let cabin in tempApplicationData[index].cabins) {
          requestedCabins +=
            tempApplicationData[index].cabins[cabin].cabinName + ', ';
        }
        requestedCabins = requestedCabins.slice(0, -2);
        newApplication.cabins = requestedCabins;

        //If the application has won before the cabins that have been won will be added to the object2
        if (tempApplicationData[index].winner === true) {
          let stringCabin = '';
          for (let cabin in tempApplicationData[index].cabinsWon) {
            stringCabin +=
              tempApplicationData[index].cabinsWon[cabin].cabinName;
          }
          newApplication.cabinsWon = stringCabin;
        }

        //Adding application to newApplicationData
        newApllicationData.push(newApplication);
      }
      setApplicationData(newApllicationData);
    }
  }, [tempApplicationData]);

  useEffect(() => {
    if (applicationData !== '') {
      setLoaded(true);
    }
  }, [applicationData]);

  return (
    <>
      {loaded && (
        <CSVLink data={applicationData} filename={'hytteapplications.csv'}>
          Convert Applications to Excel
        </CSVLink>
      )}
    </>
  );
};

export default ExcelConverter;
