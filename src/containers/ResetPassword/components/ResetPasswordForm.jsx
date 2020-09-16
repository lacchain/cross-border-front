import React, { PureComponent } from 'react';
import {
  Button,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import EyeIcon from 'mdi-react/EyeIcon';
import validate from './validate';
import { authService } from '../../../services/authService';
import { Alert, Modal } from 'reactstrap';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import renderField from '../renderField';
import { connect } from 'react-redux';
import sjcl from 'sjcl';

class ResetPasswordForm extends PureComponent {
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
      resetPasswordError: false
    };
  }

  componentDidMount = async () => {
    const { match: { params: { token } } } = this.props;
    try {
      const response = await authService.validateResetPasswordToken(token);
      if (response.status === 200) {
        this.setState({ token });
      } 
      else if (response.status === 410) {
        this.setState({ modalError: true });
      }
      else {
        this.setState({ modalErrorNotExist: true });
      }
    } 
    catch (e) {
        console.log(e);
        this.setState({ modalError: true });
    }        
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.setState({ resetPasswordError: false });
  };

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };
  onResetPassword = async (event) => {
    event.preventDefault();
    let body = {};
    body.token = this.state.token;
    var out = sjcl.hash.sha256.hash(this.props.resetPassword.values.newPassword);
    var hash = sjcl.codec.hex.fromBits(out)
    body.password = hash;
    const response = await authService.resetPassword(body);
    if (response.status === 200) {
      return this.props.history.push('/log_in');
    }
    return this.setState({resetPasswordError: true});
  }
  closeModal = () => {
    this.setState({resetPasswordModal: false})
  }
  render() {
    const {
      handleSubmit,
      invalid
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
    var modalErrorStyle = { maxWidth: 500 };

    var activationLinkExpiredStyle = {
      width: '100%', 
      textAlign: 'center', 
      marginBottom : 20, 
      marginTop: 20
    };

    return (
      <form className="form form--vertical" onSubmit={handleSubmit}>
        <div className="form__form-group">
          <span className="form__form-group-label">New password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="newPassword"
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
          <span className="form__form-group-label">Confirm new password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="confirmNewPassword"
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
          <Alert color={'danger'} className={'bold-text'} isOpen={this.state.resetPasswordError} style={alertStyle}>
            <div className="alert__content">
              Unknown error, please try again.
            </div>
          </Alert>
        </div>
        <div className="form__form-group">
        </div>
        <Button color="primary" type="submit" onClick={this.onResetPassword} style={width100} disabled={ invalid }>Set password</Button>
        <Modal 
          isOpen={ this.state.modalError }
          centered='centered'
          style={ modalErrorStyle }        
          header={ true } 
          color='primary'
        >
          <div className="form form--horizontal wizard__form">
            <span className='bold-text' style={ activationLinkExpiredStyle }>Link expired</span>
            <div>
              <span>
                Your reset password link is expired. Go to request reset password form and request a new link. Remember that reset password links are only valid for 24 hours.
              </span>
            </div>
            <Button color="primary" type="submit" onClick={() => this.props.history.push('/log_in')} style={{marginTop: 20, width: '100%'}} disabled={ invalid }>Ok</Button>
          </div>          
        </Modal> 
        <Modal 
          isOpen={ this.state.modalErrorNotExist }
          centered='centered'
          style={ modalErrorStyle }        
          header={ true } 
          color='primary'
        >
          <div className="form form--horizontal wizard__form">
            <span className='bold-text' style={ activationLinkExpiredStyle }>The reset password link you provided does not exist</span>
          </div>
          <Button color="primary" type="submit" onClick={() => this.props.history.push('/log_in')} style={{marginTop: 20, width: '100%'}} disabled={ invalid }>Ok</Button>
        </Modal>
      </form>
    );
  }
}
const mapStateToProps = state => ({
  resetPassword: state.form.resetPassword,
});

const ResetPassword = connect(
  mapStateToProps,
  null
)(ResetPasswordForm);

export default reduxForm({
  form: 'resetPassword', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(ResetPassword);
