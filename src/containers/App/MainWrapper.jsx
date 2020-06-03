import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class MainWrapper extends PureComponent {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  render() {
    const { children } = this.props;

    return (
      <div className="theme-light">
        <div className="wrapper">
          {children}
        </div>
      </div>
    );
  }
}

export default MainWrapper;
