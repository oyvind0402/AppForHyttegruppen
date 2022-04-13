import { useEffect, useState } from 'react';
import BackButton from '../../01-Reusable/Buttons/BackButton';
import HeroBanner from '../../01-Reusable/HeroBanner/HeroBanner';
import PeriodCard from '../PeriodCard';
import './EditPeriods.css';

const EditPeriods = () => {
  const [periods, setPeriods] = useState([]);

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

  const getPeriods = async () => {
    const response = await fetch('/period/all');
    const data = await response.json();
    if (response.ok) {
      setPeriods(data);
    }
  };

  useEffect(() => {
    getPeriods();
  }, []);

  return (
    <>
      <BackButton name="Tilbake til endre sideinnhold" link="admin/endringer" />
      <HeroBanner name="Endre perioder" />
      <div className="edit-periods-container">
        {periods?.map((period, index) => {
          return (
            <PeriodCard key={index}>
              <p className="edit-period-week">{period.name}</p>
              <p className="edit-period-date">
                {getFormattedDate(period.start) +
                  ' - ' +
                  getFormattedDate(period.end)}
              </p>

              <div className="edit-period-wrapper">
                <p className="edit-period-title">Navn</p>
                <input
                  type="text"
                  className="edit-period-input"
                  value={period.name}
                  onChange={(e) => {
                    period.name = e.target.value;
                    setPeriods([...periods]);
                  }}
                  id="edit-period-name"
                />
              </div>

              <div className="edit-period-wrapper">
                <p className="edit-period-title">Startdato</p>
                <input
                  type="date"
                  className="edit-period-input"
                  value={setDefaultDateValue(period.start)}
                  onChange={(e) => {
                    period.start = setDateObject(e.target.value);
                    setPeriods([...periods]);
                  }}
                  id="edit-period-startdate"
                />
              </div>

              <div className="edit-period-wrapper">
                <p className="edit-period-title">Sluttdato</p>
                <input
                  type="date"
                  className="edit-period-input"
                  value={setDefaultDateValue(period.end)}
                  onChange={(e) => {
                    period.end = setDateObject(e.target.value);
                    setPeriods([...periods]);
                  }}
                  id="edit-period-enddate"
                />
              </div>
            </PeriodCard>
          );
        })}
      </div>
    </>
  );
};

export default EditPeriods;
