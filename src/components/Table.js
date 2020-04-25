/** @jsx jsx */
// eslint-disable-next-line
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import formatDistance from 'date-fns/formatDistance';
import { sortBy } from 'lodash';
import { ReactComponent as DismissIcon } from '../svg/dismiss.svg';
import { ReactComponent as UrlIcon } from '../svg/url.svg';
// eslint-disable-next-line
import { jsx, Button, IconButton, Link } from 'theme-ui';

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENTS: (list) => sortBy(list, 'num_comments').reverse(),
  POINTS: (list) => sortBy(list, 'points').reverse(),
  CREATEDAT: (list) => sortBy(list, 'created_at_i'),
};

class Table extends PureComponent {
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
      <section>
        <header sx={{ display: ['none', 'flex'], mb: 3 }}>
          <div sx={{ flex: 16 }}>
            <Sort sortKey={'TITLE'} onSort={this.onSort} activeSortKey={sortKey}>
              Title
            </Sort>
          </div>
          <div sx={{ flex: 3 }}>
            <Sort sortKey={'AUTHOR'} onSort={this.onSort} activeSortKey={sortKey}>
              Author
            </Sort>
          </div>
          <div sx={{ flex: 1 }}>
            <Sort sortKey={'COMMENTS'} onSort={this.onSort} activeSortKey={sortKey}>
              Coms
            </Sort>
          </div>
          <div sx={{ flex: 1 }}>
            <Sort sortKey={'POINTS'} onSort={this.onSort} activeSortKey={sortKey}>
              Pts
            </Sort>
          </div>
          <div sx={{ flex: 2 }}>
            <Sort sortKey={'CREATEDAT'} onSort={this.onSort} activeSortKey={sortKey}>
              Date
            </Sort>
          </div>
          <div sx={{ flex: 1 }}></div>
        </header>

        {reverseSortedList.map((item, index) => (
          <div key={index} sx={{ display: 'flex', fontSize: '.85em' }}>
            <div sx={{ flex: 16 }}>
              <Link
                href={`https://news.ycombinator.com/item?id=${item.objectID}`}
                title={item.title ? 'Read comments' : 'Read comment'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title ? item.title : item.comment_text.substring(0, 70) + '...'}
              </Link>
              {item.url && (
                <IconButton
                  onClick={() => window.open(item.url, '_blank')}
                  title={`Go to original post: ${item.url}`}
                >
                  <UrlIcon
                    sx={{
                      fill: 'cornflowerblue',
                      width: '1.25em',
                      height: '1.25em',
                    }}
                  />
                </IconButton>
              )}
            </div>
            <div sx={{ flex: 3, display: ['none', 'block'] }}>{item.author}</div>
            <div sx={{ flex: 1, display: ['none', 'block'] }}>{item.num_comments} </div>
            <div sx={{ flex: 1, display: ['none', 'block'] }}>{item.points}</div>
            <div sx={{ flex: 2, display: ['none', 'block'] }}>
              {formatDistance(new Date(item.created_at_i * 1000), now, { addSuffix: true })}
            </div>
            <div sx={{ flex: 1, display: ['none', 'block'] }}>
              <IconButton onClick={() => onDismiss(item.objectID)}>
                <DismissIcon
                  sx={{
                    fill: 'danger',
                    width: '1em',
                    height: '1em',
                  }}
                />
              </IconButton>
            </div>
          </div>
        ))}
      </section>
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
  const colors =
    sortKey === activeSortKey
      ? {
          bg: 'muted',
          borderColor: 'primary',
        }
      : {
          bg: 'background',
        };

  return (
    <Button onClick={() => onSort(sortKey)} sx={{ variant: 'buttons.sorter', ...colors }}>
      {children}
    </Button>
  );
};

export default Table;
