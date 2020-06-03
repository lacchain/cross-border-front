import React, { PureComponent } from 'react';
import { Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import renderSelectField from '../../../shared/components/form/Select';
import validate from './validateOne';
import restService from '../../../services/restService';
import { web3Service } from '../../../services/web3Service';
import { connect } from 'react-redux';
import renderField from '../renderField';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import inputHelper from '../../../services/inputHelper';

const { updateSyncErrors, change } = require('redux-form/lib/actions').default;

class WizardFormOne extends PureComponent {

  constructor() {
    super();
    this.state = {
      showPassword: false,
      issuersData: [],
      agentBanksData: [],
      currencyAccount: '',
      fee: 1.2,
      rate: 3
    };
  }

  componentDidMount = async () => {
    let currencyAccount;
    let balanceAccount;
    let account;
    try {
      let response = await restService.get(`/api/user`);
      account = response.data.accountDetails;
      currencyAccount = account.currency;
    } catch (e) {
      return e;
    }
    balanceAccount = await web3Service.emoneyBalanceOf(account.dltAddress, account.currency);
    if (!balanceAccount) {
      balanceAccount = account.balance
    }
    this.setState({ currencyAccount, balanceAccount })
    if (this.props.wizard.values) {
      this.props.wizard.values.fee = this.state.fee;
      this.props.wizard.values.rate = this.state.rate;
      this.props.wizard.values.currencyAccount = this.state.currencyAccount;
    }
  };

  sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  calculateAmount = async (event) => {
    let amount = parseInt(event.target.value.replace(/[^0-9]/g, ''), 10)
    if (amount) {
      if (amount > parseInt(this.state.balanceAccount, 10)) {
        return this.props.dispatch(updateSyncErrors('wizard', {
          'amount': 'Amount should not be greather than your current balance'
        }));
      }
      await this.props.dispatch(change('wizard', 'recipientAmount', amount * this.state.fee));
      let recipientAmount = amount * this.state.fee;
      this.props.wizard.values.fee = this.state.fee;
      this.props.wizard.values.rate = this.state.rate;
      this.props.wizard.values.currencyAccount = this.state.currencyAccount;
      this.setState({ recipientAmount })
    }
  };

  cancel = () => {
    this.props.history.push(`/pages/accounts/${localStorage.getItem('userDltAddress')}/details`);
  }

  render() {
    const currencyMask = createNumberMask({
      prefix: `${this.state.currencyAccount} `,
      decimalLimit: 2,
      allowDecimal: true,
    });
    let currencyMaskRecipient;
    if (this.props.wizard && this.props.wizard.values && this.props.wizard.values.currency) {
      currencyMaskRecipient = createNumberMask({
        prefix: `${this.props.wizard.values.currency.value} `,
        decimalLimit: 2,
        allowDecimal: true,
      });
    } else {
      currencyMaskRecipient = createNumberMask({
        prefix: '',
        decimalLimit: 2,
        allowDecimal: true,
      });
    }
      
    const { handleSubmit } = this.props;
    const { invalid } = this.props;

    var subtitle = {
      color: '#999999',
      fontSize: 13,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 40,
      marginTop: 20
    };

    return (
      <form className="form form--horizontal wizard__form" onSubmit={handleSubmit}>
        <h3 className="wizard__title">1. Currency amount</h3>
        <h4 style={subtitle} className='gray text-center'>Enter the  amount you want to send and the target currency.
The rate is indicative, final rate is applied at the moment of the transaction. </h4>
        <div className="form__form-group">
          <span className="form__form-group-label">You send</span>
          <div className="form__form-group-field">
            <Field
              name="amount"
              component={renderField}
              type="input"
              onChange={this.calculateAmount}
              placeholder="Enter amount"
              mask={currencyMask}
              normalize={inputHelper.normalize}
            />
          </div>
          <div className="form__form-group-field">
            <p className="gray">Current account balance {this.state.currencyAccount} {inputHelper.formatNumber(this.state.balanceAccount)}</p>
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Recipient currency</span>
          <div className="form__form-group-field">
            <Field
              name="currency"
              component={renderSelectField}
              type="text"
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'MXN', label: 'MXN' },
              ]}
              placeholder="Select currency"
            />
          </div>
        </div>
        <div className="form__form-group" style={{ marginBottom: 40 }}>
          <span className="form__form-group-label">Recipient will get</span>
          <div className="form__form-group-field">
            <Field
              name="recipientAmount"
              component={renderField}
              type="text"
              mask={currencyMaskRecipient}
              normalize={inputHelper.normalize}
              disabled={true}
            />
          </div>
          <div className="form__form-group-field">
            <p className="gray">Amount is indicative, final rate applied at the moment of the transaction </p>
          </div>
        </div>
        <ButtonToolbar className="form__button-toolbar wizard__toolbar">
          <Button type="button" className="previous" onClick={this.cancel}>Cancel</Button>
          <Button color="primary" type="submit" className="next" disabled={invalid}>Continue</Button>
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

const AmountForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(WizardFormOne);

export default reduxForm({
  form: 'wizard', //                 <------ same form name
  destroyOnUnmount: false, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
})(AmountForm);
