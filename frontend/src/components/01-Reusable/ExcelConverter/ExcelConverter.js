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

  function getFormattedDate(inDate) {
    let date = new Date(inDate);
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    if (month.length < 2) {
      month = '0' + month;
    }
    let day = date.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }
    return day + '/' + month + '/' + year;
  }

  const headers = [
    { label: 'ID', key: 'applicationId' },
    { label: 'BrukerID', key: 'userId' },
    { label: 'Enterprise ID', key: 'accentureId' },
    { label: 'Type tur', key: 'tripPurpose' },
    { label: 'Periode', key: 'period' },
    { label: 'Antall hytter', key: 'numberOfCabins' },
    { label: 'Hyttetildeling', key: 'cabinAssignment' },
    { label: 'Hytter valgt', key: 'cabins' },
    { label: 'Hytter vunnet', key: 'cabinsWon' },
    { label: 'Vinner', key: 'winner' },
  ];

  const now = new Date();

  return (
    <>
      {loaded && (
        <CSVLink
          headers={headers}
          data={applicationData}
          filename={'hyttesøknader' + getFormattedDate(now) + '.csv'}
        >
          Konverter søknader til Excel (.csv fil)
        </CSVLink>
      )}
    </>
  );
};

export default ExcelConverter;
