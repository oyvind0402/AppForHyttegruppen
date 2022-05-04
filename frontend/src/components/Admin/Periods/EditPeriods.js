import { useEffect, useMemo, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import InfoPopupNoBg from '../../01-Reusable/PopUp/InfoPopupNoOverlay';
import './EditPeriods.css';
import { Link } from 'react-router-dom';
import Table2 from '../../01-Reusable/Table/Table2';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';

const EditPeriods = () => {
  const [periods, setPeriods] = useState([]);
  const [visible, setVisible] = useState(false);

  const handleVisibility = () => {
    setVisible(!visible);
  };

  /**
   * @param {*} date A date
   * @returns Date with format DD/MM/YYYY
   */
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

  const getPeriods = async () => {
    const response = await fetch('/period/all');
    const data = await response.json();
    if (response.ok) {
      setPeriods(data);
    }
  };

  const periodColumns = useMemo(() => [
    {
      Header: 'Navn',
      accessor: 'name',
    },
    {
      Header: 'Startdato',
      accessor: 'start',
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
      accessor: 'end',
      Cell: ({ cell: { value } }) => {
        return (
          <>
            <span>{getFormattedDate(value)}</span>
          </>
        );
      },
    },
    {
      Header: 'Sesong',
      accessor: 'season',
      Cell: ({ cell: { value } }) => {
        return (
          <>
            <span>{value.seasonName}</span>
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
            to={'/admin/endreperiode/' + props.row.original.id}
          >
            Endre
          </Link>
        );
      },
    },
  ]);

  useEffect(() => {
    getPeriods();
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <AdminBanner name="Endre perioder" />
      <div className="edit-periods-container">
        {periods !== null && periods.length !== 0 && (
          <Table2 columns={periodColumns} data={periods} />
        )}
      </div>
      {visible && (
        <InfoPopupNoBg
          btnText="Ok"
          hideMethod={handleVisibility}
          title="Periode endret!"
          description={
            'Perioden ble endret og endringen er lagret i databasen!'
          }
        />
      )}
    </>
  );
};

export default EditPeriods;
