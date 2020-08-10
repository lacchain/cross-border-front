import React, { PureComponent } from 'react';
import {
  Button,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import EyeIcon from 'mdi-react/EyeIcon';
import validate from './validate';
import { authService } from '../../../services/authService';
import Modal from '../../../shared/components/Modal';
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
      userDltAddress: '',
      resetPassword: false,
      resetPasswordModal: false,
      resetPasswordError: false
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
  onResetPassword = async (event) => {
    event.preventDefault();
    let body = {};
    body.email = this.props.login.values.email
    const response = await authService.requestResetPassword(body);
    if (response.status === 200) {
      return this.setState({resetPasswordModal: true});
    }
    return this.setState({resetPasswordError: true});
  }
  showResetPassword = () => {
    this.setState({resetPassword: true})
  }
  closeModal = () => {
    this.setState({resetPasswordModal: false})
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

    var width100 = {
      width: '100%',
    };

    return (
      <div>
      <div className="account__head">
          <h3 className="account__title">Welcome to
            <span className="account__logo"> LACChain
              <span className="account__logo-accent">CrossBorder</span>
            </span>
          </h3>
          <h4 className="account__subhead subhead text-center">Cross border payments using blockchain</h4>
          {this.state.resetPassword && <hr></hr>}
          {this.state.resetPassword && <h3>Request password reset</h3>}
        </div>
      <form className="form form--vertical" onSubmit={handleSubmit}>
        <Modal
            modal={this.state.resetPasswordModal}
            toggle={this.closeModal}
            color="success"
            title="Congratulations!"
            btn="Success"
            message="We have sent you an email to the email address provided to allow you to retrieve your password"
          />
        {!this.state.resetPassword ? <div style={width100}>
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
            <a href="#" onClick={this.showResetPassword}> Forgot a password?</a>
          </div>
        </div>
        <div className="form__form-group">
        </div>
        <Button color="primary" type="submit" onClick={this.onSignIn} style={width100}>Sign In</Button>
        <div class="text-center-full">
          <span>Don't have an account yet? <a href="/sign-up"> Sign up</a></span>
        </div>
        </div> : 
        <div style={width100}>
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
          </div>
          <Button color="primary" type="submit" onClick={this.onResetPassword} style={width100} disabled={this.props.login.syncErrors.email}>
            Request
          </Button>
          <Alert color={'danger'} className={'bold-text'} isOpen={this.state.resetPasswordError} style={alertStyle}>
            <div className="alert__content">
              Unknown error, please try again.
            </div>
          </Alert>
          <div class="text-center-full">
            <span>Remember your password? <a href="#" onClick={() =>this.setState({resetPassword: false})}> Login</a></span>
          </div>
        </div>}
      </form>
      </div>
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