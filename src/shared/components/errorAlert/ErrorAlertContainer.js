import { connect } from 'react-redux';
import { web3Operations } from '../../../features/web3/duck';
import ErrorAlertComponent from './ErrorAlertComponent';

const mapStateToProps = state => ({
  error: state.web3.error,
  success: state.web3.success,
});

const mapDispatchToProps = {
  setError: web3Operations.setError,
  setSuccess: web3Operations.setSuccess,
};

const ErrorAlertContainer = connect(mapStateToProps, mapDispatchToProps)(ErrorAlertComponent);

export default ErrorAlertContainer;
