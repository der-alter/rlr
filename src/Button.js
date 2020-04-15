import React from 'react';
import PropTypes from 'prop-types';

const Loading = () => <div>Loading...</div>;
const withLoading = Component => props =>
  props.isLoading ? <Loading /> : <Component {...props} />;

const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);
const ButtonWithLoading = withLoading(Button);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  className: '',
};

export { Button, ButtonWithLoading };
