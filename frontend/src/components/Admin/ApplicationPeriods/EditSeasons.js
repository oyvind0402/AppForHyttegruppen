import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import Table2 from '../../01-Reusable/Table/Table2';
import './EditSeasons.css';

const Seasons = () => {
  const [seasons, setSeasons] = useState('');

  function getFormattedDate(date) {
    const newDate = new Date(date);

    let year = newDate.getFullYear();

    let month = (1 + newDate.getMonth()).toString();
    if (month.length < 2) {
      month = '0' + month;
    }
    let day = newDate.getDate().toString();
    if (day.length < 2) {
      day = '0' + day;
    }
    return day + '/' + month + '/' + year;
  }

  const headers = [
    {
      Header: 'Navn',
      accessor: 'seasonName',
    },
    {
      Header: 'Startdato',
      accessor: 'firstDay',
      Cell: ({ cell: { value } }) => {
        return (
          <>
            <span>{getFormattedDate(value)}</span>
          </>
        );
      },
    },
    {
      Header: 'Sluttdato',
      accessor: 'lastDay',
      Cell: ({ cell: { value } }) => {
        return (
          <>
            <span>{getFormattedDate(value)}</span>
          </>
        );
      },
    },
    {
      Header: 'Kan søkes på fra',
      accessor: 'applyFrom',
      Cell: ({ cell: { value } }) => {
        return (
          <>
            <span>{getFormattedDate(value)}</span>
          </>
        );
      },
    },
    {
      Header: 'Søknadsfrist',
      accessor: 'applyUntil',
      Cell: ({ cell: { value } }) => {
        return (
          <>
            <span>{getFormattedDate(value)}</span>
          </>
        );
      },
    },
    {
      Header: 'Endre',
      Cell: (props) => {
        return (
          <Link
            className="btn link-white"
            to={'/admin/endresesong/' + props.row.original.seasonName}
          >
            Endre
          </Link>
        );
      },
    },
  ];

  const getSeasons = async () => {
    try {
      const response = await fetch('/api/season/all');
      const data = await response.json();
      if (response.ok) {
        setSeasons(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSeasons();
  }, []);

  return (
    <>
      <BackButton
        name="Tilbake til endre søknads perioder"
        link="admin/endreperioder"
      />
      <AdminBanner name="Endre sesonger" />
      <div className="editseason-container">
        {seasons !== null && seasons !== '' && typeof seasons !== undefined && (
          <Table2 columns={headers} data={seasons} />
        )}
      </div>
    </>
  );
};

export default Seasons;
