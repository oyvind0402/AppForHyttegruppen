import { useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

import BackButton from '../01-Reusable/Buttons/BackButton';
import HeroBanner from '../01-Reusable/HeroBanner/HeroBanner';
import './OpenPeriod.css';
import PeriodCard from './PeriodCard';

const OpenPeriod = () => {
  const [visible, setVisible] = useState(false);
  const [showPeriods, setShowPeriods] = useState(false);
  const [periods, setPeriods] = useState([{}]);
  const [season, setSeason] = useState({});
  const [errors, setErrors] = useState({});

  let initialPeriods = [];

  /**
   * Shows or hides the info text
   */
  const handleShowInfo = () => {
    setVisible(!visible);
  };

  /**
   * @param {*} date A date
   * @returns Weeknumber of the date
   */
  function getWeekNumber(date) {
    //Using UTC type to zero hours
    date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    var firstDayOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    var weekNumber = Math.ceil(((date - firstDayOfYear) / 86400000 + 1) / 7);

    return weekNumber;
  }

  /**
   * @param {*} date A date
   * @returns Date with format DD/MM/YYYY
   */
  function getFormattedDate(date) {
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

  /**
   * @param {*} date A date in string format
   * @returns A date object made from the parameter
   */
  const setDateObject = (date) => {
    const newDate = new Date(date);
    return newDate;
  };

  /**
   * @param {*} date A date
   * @returns A date in string format
   */
  const setDefaultDateValue = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-CA');
  };

  /**
   * Generates periods based on values for the season added by the admin
   */
  const generatePeriods = () => {
    const seasonStartDate = new Date(
      document.getElementById('startdate').value
    );
    const seasonEndDate = new Date(document.getElementById('enddate').value);
    const seasonName = document.getElementById('seasonname').value;

    let _errors = {};

    //Validation
    if (seasonEndDate < seasonStartDate) {
      _errors.dateError = 'Du valgte en sluttdato som er før startdatoen!';
    }

    if (seasonName.length < 1) {
      _errors.seasonName = 'Du skrev ikke inn et navn på perioden!';
    }

    if (seasonEndDate.toString() === 'Invalid Date') {
      _errors.seasonEndDate = 'Du må fylle inn en sluttdato!';
    }

    if (seasonStartDate.toString() === 'Invalid Date') {
      _errors.seasonStartDate = 'Du må fylle inn en startdato!';
    }

    setErrors(_errors);

    if (
      _errors.dateError ||
      _errors.seasonName ||
      _errors.seasonEndDate ||
      _errors.seasonStartDate
    ) {
      return;
    }

    //First period of the season is set to the next monday
    let firstPeriodStart = new Date(seasonStartDate);
    firstPeriodStart.setDate(
      firstPeriodStart.getDate() +
        ((1 + 7 - firstPeriodStart.getDay()) % 7 || 7)
    );

    //Setting the first periods end to be a week later
    let firstPeriodEnd = new Date(firstPeriodStart);
    firstPeriodEnd.setDate(firstPeriodEnd.getDate() + 7);

    initialPeriods.push(firstPeriodStart);
    initialPeriods.push(firstPeriodEnd);

    //Finding the amount of days between the start of the periods (after the first period)
    //and the end of the season
    const diffTime = Math.abs(seasonEndDate - firstPeriodEnd);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //Adding all start and end dates for the periods in an array
    for (let i = 0; i <= diffDays; i++) {
      if (i % 7 === 0 && i + 7 <= diffDays) {
        let startDate = new Date(firstPeriodEnd);
        startDate.setDate(startDate.getDate() + i);
        initialPeriods.push(startDate);
        if (i !== 0) {
          let endDate = new Date(firstPeriodEnd);
          endDate.setDate(endDate.getDate() + i);
          initialPeriods.push(endDate);
        }
      } else if (i % 7 === 0 && i + 7 >= diffDays) {
        if (i !== 0) {
          let endDate = new Date(firstPeriodEnd);
          endDate.setDate(endDate.getDate() + i);
          initialPeriods.push(endDate);
        }
      }
    }

    //Setting the applyTo date to be one day before the start of the first period
    let applyTo = new Date(firstPeriodStart);
    applyTo.setDate(applyTo.getDate() - 1);

    //Initializing the season object
    const seasonObj = {
      seasonName: seasonName,
      firstDay: seasonStartDate,
      lastDay: seasonEndDate,
      applyFrom: seasonStartDate,
      applyUntil: applyTo,
    };

    let objPeriods = [];

    //Creating period objects out of the previous values
    //Adding them to the new array
    initialPeriods.forEach((period, index) => {
      if (index % 2 === 0) {
        let name = 'Uke ' + getWeekNumber(period);
        let objPeriod = {
          name: name,
          season: seasonObj,
          start: period,
          end: initialPeriods[index + 1],
        };
        objPeriods.push(objPeriod);
      }
    });

    setPeriods(objPeriods);
    setSeason(seasonObj);
    setShowPeriods(true);
    console.log(objPeriods);
    console.log(seasonObj);
  };

  /**
   * Saving season and periods via requests to the backend
   */
  const saveSeasonAndPeriods = async () => {
    const response = await fetch('/season/post', {
      method: 'POST',
      body: JSON.stringify(season),
      headers: { token: localStorage.getItem('token') },
    });
    const data = response.json();
    if (response.ok) {
      console.log(data);
      periods.forEach((period) =>
        fetch('/period/post', {
          method: 'POST',
          body: JSON.stringify(period),
          headers: { token: localStorage.getItem('token') },
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.log(error))
      );
    }
  };

  /**
   * Setting initial values to the date input fields
   */
  useEffect(() => {
    document.getElementById('startdate').valueAsDate = new Date();
    let date = new Date();
    date.setDate(date.getDate() + 21);
    document.getElementById('enddate').valueAsDate = date;
  }, []);

  return (
    <>
      <BackButton name="Tilbake til admin" link="admin" />
      <HeroBanner name="Åpne søknads periode" />
      <div className="open-period-container">
        <p className="open-period-title">
          Velg start og sluttdato for søknadsperioden
        </p>

        <div className="date-wrapper">
          <label className="date-title" htmlFor="startdate">
            Startdato
          </label>
          <input type="date" id="startdate" className="open-period-date" />
          {errors.seasonStartDate && (
            <span className="login-error">{errors.seasonStartDate}</span>
          )}
        </div>
        <div className="date-wrapper">
          <label className="date-title" htmlFor="enddate">
            Sluttdato
          </label>
          <input type="date" id="enddate" className="open-period-date" />
          {errors.seasonEndDate && (
            <span className="login-error">{errors.seasonEndDate}</span>
          )}
          {errors.dateError && (
            <span className="login-error">{errors.dateError}</span>
          )}
        </div>
        <div className="date-wrapper">
          <label className="date-title" htmlFor="seasonname">
            Navn til søknadsperioden
          </label>
          <input
            placeholder="F.eks 'Vår 2022'"
            type="text"
            id="seasonname"
            className="open-period-date"
          />
          {errors.seasonName && (
            <span className="login-error">{errors.seasonName}</span>
          )}
        </div>

        <div className="period-info-button" onClick={handleShowInfo}>
          <AiOutlineQuestionCircle />
        </div>
        <p className={visible ? 'open-period-text' : 'no-show'}>
          Når du trykker på generer vil det lage ukentlige perioder fra mandag
          til mandag. <br />
          De vil ikke være lagret enda. Søknadsperioden vil være åpen fra
          startdato til sluttdato.
        </p>

        <button onClick={generatePeriods} className="btn big soknadbtn">
          Generer perioder
        </button>
        {showPeriods && periods.length !== 0 ? (
          <>
            <p className="gen-seasonname">{season.seasonName}</p>
            <p className="gen-seasondate">
              {getFormattedDate(season.firstDay) +
                ' - ' +
                getFormattedDate(season.lastDay)}
            </p>
            {periods?.map((period, index) => {
              return (
                <PeriodCard key={index}>
                  <p className="gen-period-week">{period.name}</p>
                  <p className="gen-period-date">
                    {getFormattedDate(period.start) +
                      ' - ' +
                      getFormattedDate(period.end)}
                  </p>

                  <div className="gen-period-wrapper">
                    <p className="gen-period-title">Navn</p>

                    <input
                      type="text"
                      className="gen-period-input"
                      value={period.name}
                      onChange={(e) => {
                        if (e.target.value.length > 0) {
                          period.name = e.target.value;
                          setPeriods([...periods]);
                        }
                      }}
                      id="gen-period-name"
                    />
                  </div>
                  <div className="gen-period-wrapper">
                    <p className="gen-period-title">Startdato</p>

                    <input
                      type="date"
                      id="gen-period-startdate"
                      value={setDefaultDateValue(period.start)}
                      onChange={(e) => {
                        if (
                          setDateObject(e.target.value).toString() !==
                          'Invalid Date'
                        ) {
                          period.start = setDateObject(e.target.value);
                          setPeriods([...periods]);
                        }
                      }}
                      className="gen-period-input"
                    />
                  </div>
                  <div className="gen-period-wrapper">
                    <p className="gen-period-title">Sluttdato</p>
                    <input
                      type="date"
                      id="gen-period-enddate"
                      className="gen-period-input"
                      value={setDefaultDateValue(period.end)}
                      onChange={(e) => {
                        if (
                          setDateObject(e.target.value).toString() !==
                          'Invalid Date'
                        ) {
                          period.end = setDateObject(e.target.value);
                          setPeriods([...periods]);
                        }
                      }}
                    />
                  </div>
                </PeriodCard>
              );
            })}
          </>
        ) : null}
        {showPeriods && periods.length !== 0 ? (
          <button className="btn big soknadbtn" onClick={saveSeasonAndPeriods}>
            Åpne søknadsperioden
          </button>
        ) : null}
      </div>
    </>
  );
};

export default OpenPeriod;
