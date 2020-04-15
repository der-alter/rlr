import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { sortBy } from 'lodash';
import { Button } from './Button';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
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

    return (
      <div className="pa-2 font-semibold">
        <div>
          <span className="pa-1">
            <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey}>
              Title
            </Sort>
          </span>
          <span className="pa-1">
            <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey}>
              Author
            </Sort>
          </span>
          <span className="pa-1">
            <Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKey={sortKey}>
              Comments
            </Sort>
          </span>
          <span className="pa-1">
            <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey}>
              Points
            </Sort>
          </span>
          <span className="pa-1">Archive</span>
        </div>
        <div>
          {reverseSortedList.map(item => (
            <div key={item.objectID}>
              <span className="pa-1">
                <a href={item.url}>{item.title}</a>
              </span>
              <span className="pa-1">{item.author}</span>
              <span className="pa-1">{item.num_comments}</span>
              <span className="pa-1">{item.points}</span>
              <span className="pa-1">
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  className="pa-1 rounded font-semibold text-gray-700"
                >
                  Dismiss
                </Button>
              </span>
            </div>
          ))}
        </div>
      </div>
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
