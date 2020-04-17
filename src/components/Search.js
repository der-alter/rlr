import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Search as Icon } from './svg';

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const { value, onChange, onSubmit, children } = this.props;

    return (
      <form onSubmit={onSubmit} className="flex flex-grow">
        <Icon fill="#ed8936" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(el) => (this.input = el)}
          className="flex-grow ml-2 p-4 bg-orange-100 hover:bg-white"
        />
        <button type="submit" className="button mx-2">
          {children}
        </button>
      </form>
    );
  }
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default Search;
