import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import formatDistance from 'date-fns/formatDistance';
import { sortBy } from 'lodash';
import { Button } from './Button';
import { Dismiss, Url } from './svg';

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENTS: (list) => sortBy(list, 'num_comments').reverse(),
  POINTS: (list) => sortBy(list, 'points').reverse(),
  CREATEDAT: (list) => sortBy(list, 'created_at_i'),
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    const now = new Date();

    return (
      <table className="table-auto text-xs">
        <thead className="text-left hidden md:table-header-group">
          <tr>
            <th className="px-4">
              <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey}>
                title
              </Sort>
            </th>
            <th className="px-4">
              <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey}>
                author
              </Sort>
            </th>
            <th className="px-4">
              <Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKey={sortKey}>
                coms
              </Sort>
            </th>
            <th className="px-4">
              <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey}>
                pts
              </Sort>
            </th>
            <th className="px-4">
              <Sort sortKey={'CREATEDAT'} onSort={this.onSort} activeSortKey={sortKey}>
                created at
              </Sort>
            </th>
            <td className="px-4"></td>
          </tr>
        </thead>
        <tbody>
          {reverseSortedList.map((item) => (
            <tr key={item.objectID} className="py-4 hover:bg-yellow-300">
              <td className="px-4">
                <a
                  href={`https://news.ycombinator.com/item?id=${item.objectID}`}
                  className="underline"
                  title={item.title ? 'Read comments' : 'Read comment'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.title ? item.title : item.comment_text.substring(0, 70) + '...'}
                </a>
                {item.url && (
                  <a
                    href={item.url}
                    className="ml-1 button-small"
                    title={`Go to original post: ${item.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Url className="icon ml-1" />
                  </a>
                )}
              </td>
              <td className="px-4 hidden md:table-cell">{item.author}</td>
              <td className="px-4 hidden md:table-cell">{item.num_comments} </td>
              <td className="px-4 hidden md:table-cell">{item.points}</td>
              <td className="px-4 hidden md:table-cell">
                {formatDistance(new Date(item.created_at_i * 1000), now, { addSuffix: true })}
              </td>
              <td className="px-4 hidden md:table-cell">
                <Button onClick={() => onDismiss(item.objectID)}>
                  <Dismiss className="icon" style={{ fill: '#f56565' }} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames('pa-1 rounded font-semibold text-gray-700', {
    red: sortKey === activeSortKey,
  });

  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};

export default Table;
