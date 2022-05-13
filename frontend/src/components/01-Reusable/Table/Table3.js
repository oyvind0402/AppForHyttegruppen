import { useState } from 'react';
import { useFilters, useSortBy, useTable } from 'react-table';
import './Table.css';

export default function Table3({ columns, data }) {
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
    const value = e.target.value || '';
    setFilter('email', value);
    setFilterBy(value);
  };

  if (data === null || typeof data === undefined) {
    return <></>;
  }

  return (
    <>
      <div className="react-table-center">
        <input
          className="react-table-input"
          value={filterBy}
          onChange={handleFiltering}
          placeholder={'Søk på epost...'}
        />
      </div>

      <table className="react-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => {
                return (
                  <th
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? 'sort-desc'
                          : 'sort-asc'
                        : 'react-table-header3' + index
                    }
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
                      className={'cell3' + index}
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
