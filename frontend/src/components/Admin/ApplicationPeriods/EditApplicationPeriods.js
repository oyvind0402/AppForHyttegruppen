import { useEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import './EditApplicationPeriods.css';
import { Link } from 'react-router-dom';
import Table2 from '../../01-Reusable/Table/Table2';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';
import Cookies from 'universal-cookie';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';

const EditPeriods = () => {
  const [periods, setPeriods] = useState([]);
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

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

  function getDateForDeletion(date) {
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
    return year + '-' + month + '-' + day;
  }

  const getPeriods = async () => {
    try {
      const response = await fetch('/api/period/all');
      const data = await response.json();
      if (response.ok) {
        setPeriods(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const periodColumns = [
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
  ];
  const cookies = new Cookies();
  const deletePastSeasons = async () => {
    const now = getDateForDeletion(new Date());
    try {
      const response = await fetch('/api/season/deleteolder', {
        method: 'DELETE',
        headers: { token: cookies.get('token') },
        body: JSON.stringify(now),
      });
      const data = await response.json();
      if (response.ok) {
        if (data > 0) {
          getPeriods();
          setVisible(false);
          setSuccess(true);
        }
        if (data === 0) {
          setVisible(false);
          setFail(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPeriods();
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <AdminBanner name="Endre søknads perioder" />
      <div className="edit-periods-container">
        <p className="application-period-title">Sesonger</p>
        <button className="btn-medium" onClick={handleVisibility}>
          Slett tidligere sesonger
        </button>

        <Link className="btn-medium btn-link" to="/admin/endresesonger">
          Endre sesonger
        </Link>

        <p className="application-period-title">Perioder</p>
        <Link className="btn-medium btn-link" to="/admin/leggtilperiode">
          Legg til periode
        </Link>
        {periods !== null &&
          typeof periods !== undefined &&
          periods.length !== 0 && (
            <Table2 columns={periodColumns} data={periods} />
          )}
      </div>
      {visible && (
        <AlertPopup
          positiveAction="Ja"
          negativeAction="Nei"
          cancelMethod={handleVisibility}
          acceptMethod={deletePastSeasons}
          title="Sletting av gamle sesonger!"
          description={
            'Er du sikker på at du vil slette alle gamle sesonger? Alt som har sluttdato før dagens dato vil bli slettet.\n\nOBS: dette sletter også perioder som er linket til sesongen, og alle søknader (tildelte eller avslåtte) som er linket til de periodene.'
          }
        />
      )}
      {success && (
        <InfoPopup
          btnText="Ok"
          hideMethod={() => {
            setSuccess(!success);
          }}
          title="Sletting vellykket!"
          description={'Alle gamle sesonger ble slettet!'}
        />
      )}
      {fail && (
        <InfoPopup
          btnText="Ok"
          hideMethod={() => {
            setFail(!fail);
          }}
          title="Ingen sesonger ble slettet!"
          description={
            'Det er ingen sesonger som har sluttdato før dagens dato.'
          }
        />
      )}
    </>
  );
};

export default EditPeriods;
