import React, { PureComponent } from 'react';
import { Field, reduxForm, change } from 'redux-form';
import { Button, ButtonToolbar } from 'reactstrap';
import validate from './validateTwo';
import renderField from '../renderField';
import restService from '../../../services/restService';
import { connect } from 'react-redux';
import _ from 'lodash';

const { updateSyncErrors } = require('redux-form/lib/actions').default;

class WizardFormTwo extends PureComponent {

  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount = async () => {
    this.changeBankAccount()
  };

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };
  
  changeBankAccount = async () => {
    this.sleep(50).then(async() => {
    if (this.props.wizard.values && this.props.wizard.values.recipientBankAccount){
      try {
        const response = await restService.get(`/api/user/${this.props.wizard.values.recipientDltAddress}/${this.props.wizard.values.recipientBankAccount}`);
        if (response.status === 200) {
          this.props.wizard.values.recipientBankName = response.data.bank;
          this.props.wizard.values.recipientName = response.data.name;
        } else {
          return this.props.dispatch(updateSyncErrors('wizard', {
            'recipientBankAccount': 'The DLT address and bank account does not match'
          }));
        }
  
      } catch (e) {
        return this.props.dispatch(updateSyncErrors('wizard', {
          'recipientBankAccount': 'The DLT address and bank account does not match'
        }));
      }
    }
  });
  };
  render() {
    const { handleSubmit, previousPage, invalid } = this.props;

    var subtitle = {
      color: '#999999',
      fontSize: 13,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 40,
      marginTop: 20
    };

    return (
      <form className="form form--horizontal wizard__form" onSubmit={ handleSubmit }>
      <h3 className="wizard__title">2. Recipient</h3>
      <h4 style={ subtitle } className="gray text-center">Enter the recipient´s details.</h4>
      <div className="form__form-group">
        <span className="form__form-group-label" style={{width: '160px'}}>Recipient's DLT address</span>
            <div className="form__form-group-field" style={{width: 'calc(100% - 160px)'}}>
              <Field
                name="recipientDltAddress"
                component={renderField}
                type="input"
                placeholder="Enter recipient's DLT address"
              />
            </div>
          </div>
          <div className="form__form-group">
        <span className="form__form-group-label" style={{width: '160px'}}>Recipient's bank account</span>
            <div className="form__form-group-field" style={{width: 'calc(100% - 160px)'}}>
              <Field
                name="recipientBankAccount"
                component={renderField}
                onChange = { _.debounce(this.changeBankAccount, 500) }
                type="input"
                placeholder="Enter recipient's  bank account"
              />
            </div>
          </div>
      <ButtonToolbar className="form__button-toolbar wizard__toolbar">
        <Button type="button" className="previous" onClick={ previousPage }>Back</Button>
        <Button color="primary" type="submit" className="next" disabled={ invalid }>Next</Button>
      </ButtonToolbar>
    </form>
    );
  }
}

const mapStateToProps = state => ({
  wizard: state.form.wizard,
});
const mapDispatchToProps = {
  change: change
};

const RecipientForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(WizardFormTwo);

export default reduxForm({
  form: 'wizard', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(RecipientForm);