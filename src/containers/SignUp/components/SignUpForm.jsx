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
import DomainIcon from 'mdi-react/DomainIcon';
import EthereumIcon from 'mdi-react/EthereumIcon';
import AtIcon from 'mdi-react/AtIcon';
import renderField from '../renderField';
import { web3Service } from '../../../services/web3Service';
import renderSelectField from '../../../shared/components/form/Select';
import { connect } from 'react-redux';
import sjcl from 'sjcl';

class SignUpForm extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    signup: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
      company: '',
      fullName: '',
      email: '',
      password: '',
      userDltAddress: "",
      bankName: '',
      bankTaxId: '',
      bankCity: '',
      bankAccount: '',
      signupError: '',
      visibleSignupError: false
    };
  }

  componentDidMount = () => {
    localStorage.removeItem('user');
    if (web3Service.isMetamaskInstalled) {
      this.setState({ userDltAddress: window.web3.eth.defaultAccount })
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.setState({ visibleSignupError: false });
  };

  onShowSignUpError = () => this.setState({ visibleSignupError: true });

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  onSignUp = (event) => {
    event.preventDefault()
    let form = this.props.signup.values
    validate(form)
    var out = sjcl.hash.sha256.hash(form.password);
    var hash = sjcl.codec.hex.fromBits(out)

    form.dltAddress = this.state.userDltAddress
    form.bankname = form.bankName ? form.bankName.label : ''
    authService.signUp(form, hash)
      .then(
        () => {
          const { from } = this.props.location.state || { from: { pathname: '/' } };
          this.props.history.push(from);
        }
      ).catch((error) => {
        console.log(error)
        if (error === 'Error: Request failed with status code 601') {
          this.setState({ signupError: 'The user already exists' })
          this.onShowSignUpError();
        } else {
          this.setState({ signupError: 'Something went wrong, please try again' })
        }
      })
  }

  render() {
    const { invalid } = this.props

    var alertStyle = {
      width: '100%',
      marginTop: 5,
      backgroundColor: '#ffbcbc',
      color: '#ad4444'
    };
    const { showPassword } = this.state;

    var buttonStyle = {
      width: '100%',
    };

    return (
      <form name="signup" className="form form--horizontal wizard__form" onSubmit={this.onSignUp}>
        <div className="form__form-group">
          <span className="form__form-group-label">Account details</span>
          <div className="form__form-group-field">
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">Company</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <DomainIcon />
            </div>
            <Field
              name="company"
              component={renderField}
              type="text"
              placeholder="Company"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">Full name</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              name="fullName"
              component={renderField}
              type="text"
              placeholder="Ex. Peter Smith"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">E-mail</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AtIcon />
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
          <span className="form__form-group-label text-gray">Password</span>
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
        </div>
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
          <div className="account__forgot-password">
            <Popup trigger={<a href="#"> Change metamask account</a>} position="right center">
              <div>Go to metamask extension and change the selected account</div>
            </Popup>
          </div>
        </div>
        <div className="form__form-group"></div>
        <div className="form__form-group">
          <span className="form__form-group-label">Bank details</span>
          <div className="form__form-group-field">
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">Bank Name</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <DomainIcon />
            </div>
            <Field
              name="bankName"
              component={renderSelectField}
              value={this.state.bankName}
              type="text"
              options={[
                { value: 'Citibank', label: 'Citibank' },
                { value: 'MexicanBank', label: 'Mexican Bank' },
                { value: 'PuertoRicoBank', label: 'Puerto Rico Bank' },
              ]}
              placeholder="Select bank"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">Bank Tax ID</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <DomainIcon />
            </div>
            <Field
              name="bankTaxId"
              component={renderField}
              type="text"
              placeholder="Bank tax ID"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">Bank city</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <DomainIcon />
            </div>
            <Field
              name="bankCity"
              component={renderField}
              type="text"
              placeholder="Bank city"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label text-gray">Bank account</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <DomainIcon />
            </div>
            <Field
              name="bankAccount"
              component={renderField}
              type='text'
              placeholder='Bank account'
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form__form-group">
          <Alert color={'danger'} className={'bold-text'} isOpen={this.state.visibleSignupError} style={alertStyle}>
            <div className="alert__content">
              {this.state.signupError}
            </div>
          </Alert>
        </div>
        <Button color="primary" type="submit" style={buttonStyle} disabled={invalid}>Sign Up</Button>
        <div class="text-center-full">
          <span>Already have an account ? <a href="/"> Login</a></span>
        </div>

      </form>
    );
  }
}
const mapStateToProps = state => ({
  signup: state.form.signup,
});

const SignUp = connect(
  mapStateToProps,
  null
)(SignUpForm);

export default reduxForm({
  form: 'signup', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(SignUp);
