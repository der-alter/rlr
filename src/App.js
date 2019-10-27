import React, { Component } from 'react';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const oldHits = page !== 0 ? this.state.result.hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ result: { hits: updatedHits, page } });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
    )
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ result: { ...this.state.result, hits: updatedHits } });
  }

  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    return (
      <div className="App">
        <div className="pa2 bb">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {result && <Table list={result.hits} pattern={searchTerm} onDismiss={this.onDismiss} />}
        <div className="pa2 bt">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>More</Button>
        </div>
      </div>
    );
  }
}

const Button = ({ onClick, className = '', children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);

const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="input-reset ba b--black-20 pa2"
    />
    <button type="submit" className="ml2 pa1 br2 fw6 black-70 pointer">
      {children}
    </button>
  </form>
);

const Table = ({ list, onDismiss }) => (
  <div className="pa2 f6">
    {list.map(item => (
      <div key={item.objectID}>
        <span className="pa1">
          <a href={item.url}>{item.title}</a>
        </span>
        <span className="pa1">{item.author}</span>
        <span className="pa1">{item.num_comments}</span>
        <span className="pa1">{item.points}</span>
        <span className="pa1">
          <Button onClick={() => onDismiss(item.objectID)} className="pa1 br2 fw6 black-70 pointer">
            Dismiss
          </Button>
        </span>
      </div>
    ))}
  </div>
);

export default App;
