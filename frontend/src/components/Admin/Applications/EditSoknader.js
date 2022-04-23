import { useEffect, useState, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import ExcelConverter from '../../01-Reusable/ExcelConverter/ExcelConverter';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditSoknader.css';
import Table from '../../01-Reusable/Table/Table';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';

const Applications = () => {
  const history = useHistory();
  const [allApplications, setAllApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pastWinning, setPastWinning] = useState([]);
  const [futureWinning, setFutureWinning] = useState([]);
  const [currentWinning, setCurrentWinning] = useState([]);
  const [pastPending, setPastPending] = useState([]);
  const [futurePending, setFuturePending] = useState([]);
  const [assigned, setAssigned] = useState(false);
  const [edited, setEdited] = useState(false);
  const [cabins, setCabins] = useState([]);
  const [errors, setErrors] = useState({});
  let _cabinWinners = [];
  let _changedTrips = [];

  const handleVisibility = () => {
    setAssigned(!assigned);
  };

  const handleEdited = () => {
    setEdited(!edited);
  };

  const fetchApplications = async () => {
    const allApps = await fetch('/application/all');
    const pastWinners = await fetch('/application/winners/past');
    const futureWinners = await fetch('/application/winners/future');
    const currentWinners = await fetch('/application/winners/current');
    const pastPending = await fetch('/application/pending/past');
    const futurePending = await fetch('/application/pending/future');

    const allAppsData = await allApps.json();
    const pastWinnersData = await pastWinners.json();
    const futureWinnersData = await futureWinners.json();
    const currentWinnersData = await currentWinners.json();
    const pastPendingData = await pastPending.json();
    const futurePendingData = await futurePending.json();

    if (allApps.ok) {
      setAllApplications(allAppsData);
    }

    if (pastWinners.ok) {
      setPastWinning(pastWinnersData);
    }
    if (futureWinners.ok) {
      setFutureWinning(futureWinnersData);
    }
    if (currentWinners.ok) {
      setCurrentWinning(currentWinnersData);
    }
    if (pastPending.ok) {
      setPastPending(pastPendingData);
    }
    if (futurePending.ok) {
      setFuturePending(futurePendingData);
    }
  };

  const fetchCabins = async () => {
    const response = await fetch('/cabin/active/names');
    const data = await response.json();
    if (response.ok) {
      setCabins(data);
    }
  };

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

  const pendingColumns = useMemo(() => [
    {
      Header: 'Enterprise ID',
      accessor: 'ansattnummerWBS',
    },
    {
      Header: 'Navn',
      accessor: 'user',
      Cell: ({ cell: { value } }) => {
        return <span>{value.firstname + ' ' + value.lastname}</span>;
      },
    },

    {
      Header: 'Formål',
      accessor: 'tripPurpose',
    },
    {
      Header: 'Periode',
      accessor: 'period.name',
      Cell: ({ cell: { value } }) => {
        return <span>{value}</span>;
      },
    },
    {
      Header: 'Hytte(r) ønsket',
      accessor: 'cabins',
      Cell: ({ cell: { value } }) => {
        return value.map((cabin, i) => {
          if (i === value.length - 1) {
            return <span>{cabin.cabinName}</span>;
          }
          return <span>{cabin.cabinName + ', '}</span>;
        });
      },
    },
    {
      Header: 'Tildeling',
      accessor: 'cabinAssignment',
    },
    {
      Header: 'Antall',
      accessor: 'numberOfCabins',
    },
    {
      Header: 'Kommentar',
      accessor: 'kommentar',
    },
    {
      Header: 'Tildelt',
      Cell: (props) => {
        let winner = props.row.original.winner;
        if (winner) {
          let end = new Date(props.row.original.period.end);
          let now = new Date();
          if (end > now) {
            return (
              <input
                type="checkbox"
                id={'winnercheck' + props.row.original.applicationId}
                defaultChecked={winner}
                onChange={() => {
                  addChangedTrip(props.row.original.applicationId);
                }}
              />
            );
          } else {
            if (props.row.original.cabinsWon.length > 1) {
              return (
                <span>
                  {props.row.original.cabinsWon[0].map((cabin) => {
                    return cabin.cabinName + ' ';
                  })}
                </span>
              );
            }
            if (props.row.original.cabinsWon.length === 1) {
              return <span>{props.row.original.cabinsWon[0].cabinName}</span>;
            }
          }
        }
        return (
          <div id="get-select">
            <select
              id={'add-assignment' + props.row.original.applicationId}
              multiple
              onMouseDown={(event) => {
                event.preventDefault();
                event.target.selected = !event.target.selected;
                addAssignment(props.row.original.applicationId);
              }}
            >
              {cabins.map((cabin, i) => {
                return (
                  <option
                    className="add-assignment-option"
                    key={i}
                    value={cabin}
                  >
                    {cabin}
                  </option>
                );
              })}
            </select>
          </div>
        );
      },
    },
  ]);

  const addChangedTrip = (id) => {
    let winner = document.getElementById('winnercheck' + id).checked;
    console.log(winner);
    let trip = {};
    allApplications.filter((item) => {
      if (item.applicationId === id) {
        trip = item;
      }
    });
    trip.winner = winner;

    console.log(trip.winner);

    let contains = false;

    for (let i = 0; i < _changedTrips.length; i++) {
      if (_changedTrips[i].applicationId === id) {
        contains = true;
      }
    }

    if (contains) {
      _changedTrips.forEach((item, index) => {
        if (item.applicationId === id) {
          _changedTrips.splice(index, 1);
        }
      });
    } else {
      _changedTrips.push(trip);
    }
    console.log(_changedTrips);
  };

  const addAssignment = (id) => {
    let values = document.getElementById('add-assignment' + id).selectedOptions;
    let valuesArray = [];
    Array.from(values).map(({ value }) => {
      let _value = { cabinName: value };
      valuesArray.push(_value);
    });
    const winnerAppliction = {
      applicationId: id,
      cabinsWon: valuesArray,
      winner: true,
    };

    let contains = false;

    for (let i = 0; i < _cabinWinners.length; i++) {
      if (_cabinWinners[i].applicationId === id) {
        contains = true;
      }
    }

    if (contains) {
      _cabinWinners.forEach((item, index) => {
        if (item.applicationId === id) {
          if (valuesArray.length > 0) {
            item.cabinsWon = valuesArray;
          } else {
            _cabinWinners.splice(index, 1);
          }
        }
      });
    } else {
      _cabinWinners.push(winnerAppliction);
    }
    console.log(_cabinWinners);
  };

  const postWinners = () => {
    if (applications === futurePending) {
      let _errors = {};
      if (_cabinWinners.length === 0) {
        _errors.assignment =
          "For å tildele hytter må du trykke på en hytte i kolonnen 'Tildelt' for en søknad!";
      }

      setErrors(_errors);

      if (_errors.assignment) {
        return;
      }

      _cabinWinners.forEach((cabinWinner) => {
        fetch('/application/setwinner', {
          method: 'PATCH',
          headers: { token: localStorage.getItem('refresh_token') },
          body: JSON.stringify(cabinWinner),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      });
      localStorage.setItem('assignedCabins', _cabinWinners);
      fetchApplications();
      setAssigned(true);
    } else if (
      applications === pastPending ||
      applications === currentWinning
    ) {
    } else {
      let _errors = {};
      if (_changedTrips.length === 0) {
        _errors.assignment = 'Du har ikke endret en hytte!';
      }

      setErrors(_errors);

      if (_errors.assignment) {
        return;
      }

      _changedTrips.forEach((application) => {
        fetch('/application/update', {
          method: 'PUT',
          headers: { token: localStorage.getItem('refresh_token') },
          body: JSON.stringify(application),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      });
      fetchApplications();
      setEdited(true);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchCabins();
  }, []);

  useEffect(() => {
    setApplications(futurePending);
    document.getElementById('futurePending').checked = true;
  }, [futurePending]);

  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <HeroBanner name="Alle søknader" />
      {/* <ExcelConverter /> */}
      {applications === null && (
        <p className="application-title">Søknader / turer (0)</p>
      )}
      {applications !== null && (
        <p className="application-title">
          {applications === futurePending &&
            'Søknader (' + applications.length + ')'}
          {applications === pastPending &&
            'Tidligere søknader (' + applications.length + ')'}
          {applications === pastWinning &&
            'Tidligere turer (' + applications.length + ')'}
          {applications === futureWinning &&
            'Fremtidige turer (' + applications.length + ')'}
          {applications === currentWinning &&
            'Nåværende turer (' + applications.length + ')'}
        </p>
      )}
      <div className="tab-container">
        <div className="checkbox-trip-container">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="futurePending"
            onChange={() => {
              setApplications(futurePending);
              setErrors({});
              console.log(futurePending);
            }}
          />
          <label htmlFor="futurePending" className="checkbox-trip-label">
            Søknader
          </label>
        </div>
        <div className="checkbox-trip-container">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="pastPending"
            onChange={() => {
              setApplications(pastPending);
              setErrors({});
              console.log(pastPending);
            }}
          />
          <label htmlFor="pastPending" className="checkbox-trip-label">
            Tidligere søknader
          </label>
        </div>
        <div className="checkbox-trip-container">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="futureWinning"
            onChange={() => {
              setApplications(futureWinning);
              setErrors({});
              console.log(futureWinning);
            }}
          />
          <label htmlFor="futureWinning" className="checkbox-trip-label">
            Fremtidige turer
          </label>
        </div>
        <div className="checkbox-trip-container">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="pastWinning"
            onChange={() => {
              setApplications(pastWinning);
              setErrors({});
              console.log(pastWinning);
            }}
          />
          <label htmlFor="pastWinning" className="checkbox-trip-label">
            Tidligere turer
          </label>
        </div>
        <div className="checkbox-trip-container">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="currentWinning"
            onChange={() => {
              setApplications(currentWinning);
              setErrors({});
              console.log(currentWinning);
            }}
          />
          <label htmlFor="currentWinning" className="checkbox-trip-label">
            Nåværende turer
          </label>
        </div>
      </div>

      <div>
        {applications !== null && applications.length !== 0 ? (
          <Table columns={pendingColumns} data={applications} cabins={cabins} />
        ) : null}
      </div>
      <div className="button-soknad-container">
        {applications !== null && applications.length !== 0 && (
          <button
            onClick={() => postWinners(_cabinWinners)}
            className="btn big"
          >
            {applications === futurePending ? 'Tildel hytter' : 'Endre turer'}
          </button>
        )}

        {errors.assignment && (
          <span className="login-error">{errors.assignment}</span>
        )}
      </div>
      {assigned && (
        <AlertPopup
          title="Hytter tildelt"
          description="Hytter ble tildelt og lagret i databasen, vil du se en oversikt over fremtidige turer?"
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={() => {
            setApplications(futureWinning);
            document.getElementById('futureWinning').checked = true;
            setAssigned(false);
          }}
        />
      )}
      {edited && (
        <InfoPopup
          title="Hytter endret"
          description="Hytte(r) ble endret og lagret i databasen, du vil nå bli sendt til alle søknader."
          btnText="Ok"
          hideMethod={handleEdited}
        />
      )}
    </>
  );
};

export default Applications;
