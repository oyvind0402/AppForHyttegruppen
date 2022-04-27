import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

const ExcelConverter = (props) => {
  const [tempApplications, setTempApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loaded, setLoaded] = useState(false);

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
    { label: 'Navn', key: 'user' },
    { label: 'Enterprise ID', key: 'accentureId' },
    { label: 'Ansattnummer/WBS', key: 'ansattnummerWBS' },
    { label: 'Type tur', key: 'tripPurpose' },
    { label: 'Periode', key: 'period' },
    { label: 'Antall hytter', key: 'numberOfCabins' },
    { label: 'Tildeling', key: 'cabinAssignment' },
    { label: 'Hytter ønsket', key: 'cabins' },
    { label: 'Kommentar', key: 'kommentar' },
    { label: 'Tildelt', key: 'cabinsWon' },
    { label: 'Vinner', key: 'winner' },
  ];

  useEffect(() => {
    setTempApplications(props.data);
  }, []);

  useEffect(() => {
    if (tempApplications.length > 0) {
      const newApplications = [];

      tempApplications.forEach((application) => {
        let newApplication = {
          applicationId: application.applicationId,
          user: application.user.firstname + ' ' + application.user.lastname,
          ansattnummerWBS: application.ansattnummerWBS,
          accentureId: application.accentureId,
          tripPurpose: application.tripPurpose,
          period:
            application.period.name +
            ' (' +
            getFormattedDate(application.period.start) +
            ' - ' +
            getFormattedDate(application.period.end) +
            ')',
          numberOfCabins: application.numberOfCabins,
          cabinAssignment: application.cabinAssignment,
          cabins: '',
          cabinsWon: '',
          kommentar: application.kommentar,
          winner: application.winner,
        };

        let requestedCabins = '';
        application.cabins.forEach((cabin) => {
          requestedCabins += cabin.cabinName + ', ';
        });
        requestedCabins = requestedCabins.slice(0, -2);
        newApplication.cabins = requestedCabins;

        if (application.winner) {
          let stringCabin = '';
          application.cabinsWon.forEach((cabin) => {
            stringCabin += cabin.cabinName;
          });
          newApplication.cabinsWon = stringCabin;
        }
        console.log(newApplication);
        newApplications.push(newApplication);
      });
      setApplications(newApplications);
    }
  }, [tempApplications]);

  useEffect(() => {
    if (applications !== null) {
      setLoaded(true);
    }
  }, [applications]);

  const now = new Date();

  return (
    <>
      {loaded && (
        <CSVLink
          headers={headers}
          data={applications}
          filename={'hyttesøknader' + getFormattedDate(now) + '.csv'}
        >
          Konverter søknader til Excel (.csv fil)
        </CSVLink>
      )}
    </>
  );
};

export default ExcelConverter;
