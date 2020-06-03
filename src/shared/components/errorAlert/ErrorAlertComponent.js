import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorAlertComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate = async (prevProps) => {
    this.setError(prevProps);
    this.setSuccess(prevProps);
  };

  setError = (prevProps) => {
    if (!this.props.error || this.props.error === prevProps.error) {
      return;
    }

    this.onError(this.props.error);

    setTimeout(() => this.props.setError(null), 2000);
  };

  setSuccess = (prevProps) => {
    if (!this.props.success || this.props.success === prevProps.success) {
      return;
    }

    this.onSuccess(this.props.success);

    setTimeout(() => this.props.setSuccess(null), 5000);
  };

  onError = error => {
    if (error) {
      console.log(error);
    }
  };

  onSuccess = success => {
    if (success) {
      console.log(success);
    }
  };

  render() {
    return (
      <div></div>
    );
  }
}

ErrorAlertComponent.propTypes = {
  error: PropTypes.string,
  success: PropTypes.string,
  setError: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
};
