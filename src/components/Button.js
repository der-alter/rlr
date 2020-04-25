import React from 'react';
import PropTypes from 'prop-types';
import { Button as B, Spinner } from 'theme-ui';

const withLoading = (Component) => (props) =>
  props.isLoading ? <Spinner /> : <Component {...props} />;

const Button = ({ onClick, children }) => (
  <B onClick={onClick} type="button">
    {children}
  </B>
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
