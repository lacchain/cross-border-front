import React, { PureComponent } from 'react';
import {
  Button,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import EyeIcon from 'mdi-react/EyeIcon';
import validate from './validate';
import { authService } from '../../../services/authService';
import Popup from 'reactjs-popup';
import { Alert } from 'reactstrap';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import EthereumIcon from 'mdi-react/EthereumIcon';
import { web3Service } from '../../../services/web3Service';
import renderField from '../renderField';
import { connect } from 'react-redux';
import { userService } from '../../../services/userService';

class LogInForm extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    login: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
      email: '',
      password: '',
      visibleLoginError: false,
      userDltAddress: ''
    };
  }

  componentDidMount = () => {
    localStorage.removeItem('user');
    if(web3Service.isMetamaskInstalled) {
      this.setState({userDltAddress: window.web3.eth.defaultAccount})
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.setState({ visibleLoginError: false });
  };

  onShowLoginError = () => this.setState({ visibleLoginError: true });

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  onSignIn = (event) => {
    event.preventDefault();
    let form = this.props.login.values
    authService.getToken(form.email, form.password, window.web3.eth.defaultAccount)
      .then(
        () => {
          if (userService.isCiti()) {
            const { from } = this.props.location.state || { from: { pathname: '/pages/accounts' } };
            this.props.history.push(from);
          } else {
            const { from } = this.props.location.state || { from: { pathname: `/pages/accounts/${this.state.userDltAddress}/details`} };
            this.props.history.push(from);
          }
        }
      ).catch(() => this.onShowLoginError());
  }

  render() {
    const {
      handleSubmit,
    } = this.props;

    const { showPassword } = this.state;

    var alertStyle = {
      width: '100%',
      marginTop: 5,
      backgroundColor: '#ffbcbc',
      color: '#ad4444'
    };

    var buttonStyle = {
      width: '100%',
    };

    return (
      <form className="form form--vertical" onSubmit={handleSubmit}>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">DLT Address</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <EthereumIcon />
            </div>
            <Field
              name="userDltAddress"
              component={renderField}
              placeholder={this.state.userDltAddress}
              type="text"
              disabled={true}
            />
          </div>
          </div>
        <div className="form__form-group">
          <span className="form__form-group-label">E-mail</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              name="email"
              component={renderField}
              type="email"
              placeholder="example@mail.com"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="password"
              component={renderField}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              onChange={this.handleChange}
            />
            <button
              type="button"
              className={`form__form-group-button${showPassword ? ' active' : ''}`}
              tabIndex="-1"
              onClick={e => this.showPassword(e)}
            ><EyeIcon />
            </button>
          </div>
          <Alert color={'danger'} className={'bold-text'} isOpen={this.state.visibleLoginError} style={alertStyle}>
            <div className="alert__content">
              Invalid email,  password  or DLT address
            </div>
          </Alert>
          <div className="account__forgot-password">
            <Popup trigger={<a href="#"> Forgot a password?</a>} position="right center">
              <div>To recover your password get in touch with the system administrator through the email: tech@io.builders</div>
            </Popup>
          </div>
        </div>
        <div className="form__form-group">
        </div>
        <Button color="primary" type="submit" onClick={this.onSignIn} style={buttonStyle}>Sign In</Button>
        <div class="text-center-full">
          <span>Don't have an account yet? <a href="/sign-up"> Sign up</a></span>
        </div>
      </form>
    );
  }
}
const mapStateToProps = state => ({
  login: state.form.login,
});

const LogIn = connect(
  mapStateToProps,
  null
)(LogInForm);

export default reduxForm({
  form: 'login', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(LogIn);

