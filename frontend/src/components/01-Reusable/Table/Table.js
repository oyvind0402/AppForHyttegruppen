import { useState } from 'react';
import { useFilters, useSortBy, useTable } from 'react-table';
import './Table.css';

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
  } = useTable({ columns, data }, useFilters, useSortBy);
  const [filterBy, setFilterBy] = useState('');

  const handleFiltering = (e) => {
    const value = e.target.value || undefined;
    setFilter('period.name', value);
    setFilterBy(value);
  };

  return (
    <>
      <div className="react-table-center">
        <input
          className="react-table-input"
          value={filterBy}
          onChange={handleFiltering}
          placeholder={'Søk på periode...'}
        />
      </div>

      <table className="react-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                if (column.Header === 'Tildelt') {
                  let winner = data[0].winner;
                  if (winner) {
                    let end = new Date(data[0].period.end);
                    let now = new Date();

                    if (end > now) {
                      column.Header = 'Vinner';
                    } else {
                      column.Header = 'Tildelt';
                    }
                  }
                }

                return (
                  <th
                    className={'react-table-header' + index}
                    key={index}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      className={'cell' + index}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
