import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

const ExcelConverterPayCheck = (props) => {
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
    { label: 'Privat/Prosjekt', key: 'tripPurpose' },
    { label: 'Periode', key: 'period' },
    { label: 'WBS', key: 'ansattnummerWBS' },
    { label: 'Kommentar', key: 'kommentar' },
    { label: 'Tildelt', key: 'cabinsWon' },
  ];

  useEffect(() => {
    if (props.data.length > 0) {
      const newApplications = [];

      props.data.forEach((application) => {
        let newApplication = {
          user: application.user.firstname + ' ' + application.user.lastname,
          ansattnummerWBS: application.ansattnummerWBS,
          tripPurpose: application.tripPurpose,
          period:
            application.period.name +
            ' (' +
            getFormattedDate(application.period.start) +
            ' - ' +
            getFormattedDate(application.period.end) +
            ')',
          cabinsWon: '',
          kommentar: application.kommentar,
        };

        let requestedCabins = '';
        application.cabins.forEach((cabin) => {
          requestedCabins += cabin.cabinName + ', ';
        });
        requestedCabins = requestedCabins.slice(0, -2);
        newApplication.cabins = requestedCabins;

        if (application.winner) {
          let stringCabin = '';
          try {
            application.cabinsWon.forEach((cabin) => {
              stringCabin += cabin.cabinName;
            });
          } catch (error) {}

          newApplication.cabinsWon = stringCabin;
        }
        newApplications.push(newApplication);
      });
      setApplications(newApplications);
    }
  }, [props.data]);

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
          Konverter tidligere turer (fra valgt sesong) til Excel lønnsslipp
          (.csv fil)
        </CSVLink>
      )}
    </>
  );
};

export default ExcelConverterPayCheck;
