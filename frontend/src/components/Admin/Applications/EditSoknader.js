import { useEffect, useState, useMemo } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import ExcelConverter from '../../01-Reusable/ExcelConverter/ExcelConverter';
import AlertPopup from '../../01-Reusable/PopUp/AlertPopup';
import './EditSoknader.css';
import Table from '../../01-Reusable/Table/Table';
import InfoPopup from '../../01-Reusable/PopUp/InfoPopup';
import ExcelConverterPayCheck from '../../01-Reusable/ExcelConverter/ExcelPaycheckConverter';
import AdminBanner from '../../01-Reusable/HeroBanner/AdminBanner';

const Applications = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pastWinning, setPastWinning] = useState([]);
  const [pastWinningCopy, setPastWinningCopy] = useState([]);
  const [futureWinning, setFutureWinning] = useState([]);
  const [currentWinning, setCurrentWinning] = useState([]);
  const [pastPending, setPastPending] = useState([]);
  const [futurePending, setFuturePending] = useState([]);
  const [assigned, setAssigned] = useState(false);
  const [edited, setEdited] = useState(false);
  const [cabins, setCabins] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [errors, setErrors] = useState({});
  const [cabinWinners, setCabinWinners] = useState([]);
  const [changedTrips, setChangedTrips] = useState([]);
  let _cabinWinners = [];
  let _changedTrips = [];

  const handleVisibility = () => {
    setAssigned(!assigned);
  };

  const handleEdited = () => {
    setEdited(!edited);
  };

  const fetchSeasons = async () => {
    const response = await fetch('/season/all');
    const data = await response.json();
    if (response.ok) {
      setSeasons(data);
    }
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
      setPastWinningCopy(pastWinnersData);
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

  const pendingColumns = useMemo(() => [
    {
      Header: 'Enterprise ID',
      accessor: 'accentureId',
    },
    {
      Header: 'Ansattnummer',
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
      Cell: (props) => {
        return <span>{props.row.original.period.name}</span>;
      },
    },
    {
      Header: 'Hytte(r) ønsket',
      accessor: 'cabins',
      Cell: ({ cell: { value } }) => {
        if (value !== null && value.length > 0) {
          return value.map((cabin, i) => {
            if (i === value.length - 1) {
              return <span>{cabin.cabinName}</span>;
            }
            return <span>{cabin.cabinName + ', '}</span>;
          });
        } else {
          return <span></span>;
        }
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
          let start = new Date(props.row.original.period.start);
          let now = new Date();
          if (start > now) {
            return (
              <>
                <input
                  type="checkbox"
                  id={'winnercheck' + props.row.original.applicationId}
                  defaultChecked={winner}
                  onChange={() => {
                    addChangedTrip(props.row.original.applicationId);
                  }}
                />
                <br />
                <span>
                  Tildelte hytte(r): <br />
                  {props.row.original.cabinsWon.map((cabin) => {
                    return cabin.cabinName + ' ';
                  })}
                </span>
              </>
            );
          } else {
            let cabinWonLenght;
            try {
              cabinWonLenght = props.row.original.cabinsWon.length;
            } catch (error) {
              //Empty
              return <span></span>;
            }
            if (cabinWonLenght > 1) {
              return (
                <span>
                  {props.row.original.cabinsWon[0].map((cabin) => {
                    return cabin.cabinName + ' ';
                  })}
                </span>
              );
            }
            if (cabinWonLenght === 1) {
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
    let trip = {};
    allApplications.forEach((item) => {
      if (item.applicationId === id) {
        trip = item;
      }
    });
    trip.winner = winner;

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
  };

  const addAssignment = (id) => {
    let values = document.getElementById('add-assignment' + id).selectedOptions;
    let valuesArray = [];
    Array.from(values).forEach(({ value }) => {
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

  const handleApplications = () => {
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

      setCabinWinners(_cabinWinners);
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

      setChangedTrips(_changedTrips);
      setEdited(true);
    }
  };

  const assignCabins = () => {
    let postSuccessful = true;

    cabinWinners.forEach((cabinWinner) => {
      fetch('/application/setwinner', {
        method: 'PATCH',
        headers: { token: localStorage.getItem('refresh_token') },
        body: JSON.stringify(cabinWinner),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => {
          console.log(error);
          postSuccessful = false;
        });
    });
    if (postSuccessful) {
      cabinWinners.forEach((cabinWinner) => {
        fetch('/email/applicationApproved', {
          method: 'POST',
          body: JSON.stringify(cabinWinner.applicationId),
        })
          .then((data) => console.log(data))
          .catch((error) => console.log(error));
      });
    }
    fetchApplications();
    setAssigned(false);
  };

  const editApplications = () => {
    changedTrips.forEach((application) => {
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
    setEdited(false);
  };

  const filterSeason = (type) => {
    if (type === 'all') {
      setPastWinning(pastWinningCopy);
      setApplications(pastWinningCopy);
    } else {
      const filteredTrips = pastWinningCopy.filter((trip) => {
        if (trip.period.season.seasonName === type) {
          return trip;
        }
      });
      setApplications(filteredTrips);
      setPastWinning(filteredTrips);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchCabins();
    fetchSeasons();
  }, []);

  useEffect(() => {
    setApplications(futurePending);
    document.getElementById('futurePending').checked = true;
    document.getElementById('futureWinning').checked = false;
  }, [futurePending]);

  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <AdminBanner name="Alle søknader" />
      {applications !== null ? (
        <ExcelConverter data={applications} />
      ) : (
        <p className="hidden-text"></p>
      )}
      {applications !== null &&
      applications === pastWinning &&
      pastWinning.length !== 0 ? (
        <>
          <br />
          <ExcelConverterPayCheck data={applications} />
        </>
      ) : (
        <p className="hidden-text"></p>
      )}
      {applications === null && (
        <p className="application-title">Søknader / turer (0)</p>
      )}
      {applications !== null && (
        <p className="application-title">
          {applications === futurePending &&
            'Søknader (' + applications.length + ')'}
          {applications === pastPending &&
            'Avslåtte søknader (' + applications.length + ')'}
          {applications === pastWinning &&
            'Tidligere turer (' + applications.length + ')'}
          {applications === futureWinning &&
            'Fremtidige turer (' + applications.length + ')'}
          {applications === currentWinning &&
            'Nåværende turer (' + applications.length + ')'}
        </p>
      )}
      <div className="tab-container">
        <div className="checkbox-trip-container" id="chckb1">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            tabIndex={'0'}
            id="futurePending"
            aria-label="radio button for applications"
            onChange={() => {
              setApplications(futurePending);
              setErrors({});
            }}
          />
          <label htmlFor="futurePending" className="checkbox-trip-label">
            Søknader
          </label>
        </div>
        <div className="checkbox-trip-container" id="chckb2">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="pastPending"
            tabIndex={'0'}
            aria-label="radio button for declined applications"
            onChange={() => {
              setApplications(pastPending);
              setErrors({});
            }}
          />
          <label htmlFor="pastPending" className="checkbox-trip-label">
            Avslåtte søknader
          </label>
        </div>
        <div className="checkbox-trip-container" id="chckb3">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="futureWinning"
            tabIndex={'0'}
            aria-label="radio button for future won trips"
            onChange={() => {
              setApplications(futureWinning);
              setErrors({});
            }}
          />
          <label htmlFor="futureWinning" className="checkbox-trip-label">
            Fremtidige turer
          </label>
        </div>
        <div className="checkbox-trip-container" id="chckb4">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="pastWinning"
            tabIndex={'0'}
            aria-label="radio button for past won trips"
            onChange={() => {
              setApplications(pastWinning);
              setErrors({});
            }}
          />
          <label htmlFor="pastWinning" className="checkbox-trip-label">
            Tidligere turer
          </label>
        </div>
        <div className="checkbox-trip-container" id="chckb5">
          <input
            name="tripLink"
            className="change-trip-type"
            type="radio"
            id="currentWinning"
            tabIndex={'0'}
            aria-label="radio button for current trips"
            onChange={() => {
              setApplications(currentWinning);
              setErrors({});
            }}
          />
          <label htmlFor="currentWinning" className="checkbox-trip-label">
            Nåværende turer
          </label>
        </div>
      </div>

      {applications !== null &&
        applications === pastWinning &&
        seasons !== null && (
          <div className="filter-container">
            <select
              onChange={(e) => filterSeason(e.target.value)}
              className="season-filter"
            >
              <option value="all">Alle sesonger</option>
              {seasons.map((season, index) => {
                return (
                  <option key={index} value={season.seasonName}>
                    {season.seasonName}
                  </option>
                );
              })}
            </select>
          </div>
        )}

      <div>
        {applications !== null && applications.length !== 0 ? (
          <Table columns={pendingColumns} data={applications} />
        ) : null}
      </div>
      <div className="button-soknad-container">
        {applications !== null &&
          applications.length !== 0 &&
          applications !== pastPending &&
          applications !== pastWinning &&
          applications !== currentWinning && (
            <button
              onClick={() => handleApplications(_cabinWinners)}
              className="btn big"
            >
              {applications === futurePending
                ? 'Tildel hytter'
                : 'Lagre endringer'}
            </button>
          )}

        {errors.assignment && (
          <span className="login-error">{errors.assignment}</span>
        )}
      </div>
      {assigned && (
        <AlertPopup
          title="Tildeling av hytter"
          description="Er du sikker på at du vil tildele hyttene? Hvis du trykker ja vil det bli sendt en epost til alle brukerene som vil få tildelt en hytte."
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleVisibility}
          acceptMethod={assignCabins}
        />
      )}
      {edited && (
        <AlertPopup
          title="Endre vinner"
          description="Er du sikker på at du vil endre turen til å ikke ha tildelt en hytte? Dette vil gjøre så turen ikke er satt som vinner lenger."
          negativeAction="Nei"
          positiveAction="Ja"
          cancelMethod={handleEdited}
          acceptMethod={editApplications}
        />
      )}
    </>
  );
};

export default Applications;
