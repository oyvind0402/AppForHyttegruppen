import { useEffect, useState } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import { FaRandom } from 'react-icons/fa';
import { GiPrivate } from 'react-icons/gi';

const ExcelConverter = (props) => {
  const [applicationData, setApplicationData] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      fetch('/application/all')
        .then((response) => response.json())
        .then((data) => setApplicationData(data))
        .catch((error) => console.log(error));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (applicationData !== '') {
      setLoaded(true);
    }
  }, [applicationData]);

  useEffect(() => {
    if (loaded) {
      /* CONVERT THE DATA */
      const newApllicationData = [
        {
          applicationId: 1,
          userId: 'Z5CBgnCHiFsYXMmNdBYmKA',
          accentureId: 'accentureId',
          tripPurpose: 'private',
          period: 'Uke 1',
          numberOfCabins: 1,
          cabinAssignment: 'random',
          cabins: 'Utsikten, Fanitullen, Store Grøndalen, Knausen',
          cabinsWon: '',
          winner: false,
        },
        {
          applicationId: 2,
          userId: 'Z5CBgnCHiFsYXMmNdBYmKA',
          accentureId: 'accentureId',
          tripPurpose: 'private',
          period: 'Uke 1',
          numberOfCabins: 1,
          cabinAssignment: 'random',
          cabins: 'Utsikten, Fanitullen, Store Grøndalen, Knausen',
          cabinsWon: '',
          winner: false,
        },
      ];
      for (let index in applicationData) {
        console.log(applicationData[index].applicationId);
      }

      setApplicationData(newApllicationData);
    }
  }, [loaded]);

  return <>{loaded && <CSVLink data={applicationData}>Download me</CSVLink>}</>;
};

export default ExcelConverter;
