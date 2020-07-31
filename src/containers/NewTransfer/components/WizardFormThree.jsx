import React from 'react';
import { Alert, Button, ButtonToolbar } from 'reactstrap';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import LoadingIcon from 'mdi-react/LoadingIcon';

const WizardFormThree = ({ handleSubmit, previousPage, wizard, submitError, changeTransferData, changeRecipientData, loading }) => {
  let transfer = wizard.values;
  const inlineStyle = {
    display: 'inline-flex',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px'
  }
  const inlineStyleParent = {
    display: 'inline-flex',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '20px',
    paddingBottom: '10px'
  }

  let subtitle = {
    color: '#999999',
    fontSize: 13,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center'
  };
  const expandClass = classNames({
    icon: true,
    expand: true,
    'expand--load': loading,
  });
  return (
    <form className="form form--horizontal wizard__form" onSubmit={handleSubmit}>
      <h3 className="wizard__title">3. Review and confirm</h3>
      <h4 style={subtitle} className="gray text-center">Review the operation details.
The rate applied is indicative, final rate is applied at the moment of the transaction. </h4>
      <div style={{width: '100%'}}>
        <div style={{ width: '480px', margin: 'auto', borderStyle: 'solid', borderColor: '#e1e1e1', height: 'fit-content' }}>
        <div style={inlineStyleParent}>
            <p className="review-wizard-title-text">Transfer details</p>
            <a className="text-link" onClick={changeTransferData}>Change</a>
          </div>
          <div style={inlineStyle}>
            <p className="review-wizard-text">You send:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px', fontSize: '18px' }}>{transfer.amount + ' ' + transfer.currencyAccount}</p>
          </div>
          <div style={inlineStyle}>
            <p className="review-wizard-text">Fee aplied:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px' }}>N/A</p>
          </div>
          {/* <div style={inlineStyle}>
            <p className="review-wizard-text">Amount converted:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px' }}>{transfer.amount - transfer.fee  + ' ' + transfer.currencyAccount}</p>
          </div> */}
          <div style={inlineStyle}>
            <p className="review-wizard-text">Rate applied:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px' }}>{transfer.rate}</p>
          </div>
          <div style={inlineStyle}>
            <p className="review-wizard-text">Recipient will get:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px' }}>{transfer.recipientAmount} {transfer.currency.value}</p>
          </div>
          <div style={inlineStyleParent}>
            <p className="review-wizard-title-text">Recipient details</p>
            <a className="text-link" onClick={changeRecipientData}>Change</a>
          </div>
          <div style={inlineStyle}>
            <p className="review-wizard-text">Name:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px' }}>{transfer.recipientName}</p>
          </div>
          <div style={inlineStyle}>
            <p className="review-wizard-text">Bank:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px'}}>{transfer.recipientBankName}</p>
          </div>
          <div style={inlineStyle}>
            <p className="review-wizard-text">Bank account:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px' }}>{transfer.recipientBankAccount}</p>
          </div>
          <div style={inlineStyle}>
            <p className="review-wizard-text" style={{marginBottom: '10px'}}>DLT address:</p>
            <p className="bold-text-gray" style={{ marginTop: '0px', marginBottom: '10px' }}>{transfer.recipientDltAddress}</p>
          </div>
        </div>
        <Alert color={'danger'} className={'bold-text'} isOpen={submitError} style={{ width: '100%', marginTop: 5, backgroundColor: '#ffbcbc', color: '#ad4444' }}>
          <div className="alert__content">
            Sorry, an unknown error heppen in the system when creating your transfer. <br /><br />

            <span>Hint: {submitError}</span>
          </div>
        </Alert>
        <ButtonToolbar className="form__button-toolbar wizard__toolbar" style={{display: 'block', textAlign: 'center', marginTop: '20px'}}>
          <Button type="button" className="previous" onClick={previousPage}>Back</Button>
          <Button type="submit" color={'primary'} className={expandClass}>
              <p><LoadingIcon />Confirm</p></Button>
        </ButtonToolbar>
      </div>
    </form >
  );
};

WizardFormThree.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  wizard: state.form.wizard,
  wizard_custodian: state.form.wizard_custodian,
});

const PaymentForm = connect(
  mapStateToProps,
  null
)(WizardFormThree);

export default reduxForm({
  form: 'wizard', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(PaymentForm);
