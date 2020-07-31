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
import XMLParser from 'react-xml-parser'
const { updateSyncErrors, change } = require('redux-form/lib/actions').default;
var builder = require('xmlbuilder');

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
  buildXmlBody = (amount) => {
    let body = builder.create('IFX', {'type': 'git'})
    .ele('SignonRq')
     .ele('ClientDt').txt('2020-06-09T06:55:42').up()
     .ele('CustLangPref').txt('ENGLISH').up()
     .ele('ClientApp')
     .ele('Org').txt('IDB').up()
     .ele('Name').txt('Blockchain POC').up()
     .ele('Version').txt('1.0').up()
     .up()
     .up()
     .ele('BankSvcRq')
     .ele('RqUID').txt('CR3113-Main-APIm-TC080').up()
     .ele('ForExRateInqRq')
     .ele('RqUID').text('CR3113-Main-APIm-TC08A').up()
     .ele('CustId')
     .ele('SPName').txt('CTSI').up()
     .ele('CustPermId').txt('812660001').up()
     .up()
     .ele('DepAcctId')
     .ele('AcctId').text('31208277').up()
     .ele('AcctType').text('SD').up()
     .ele('BankInfo').up()
     .up()
     .ele('RemitAmt').txt(amount).up()
     .ele('RemitCurCode').txt('USD').up()
     .ele('IssueCurCode').txt('DOP').up()
     .ele('ForExRateType').txt('Indicated').up()
     .ele('ForExRateDealType').txt('BUY').up()
     .ele('ForExValDtType').txt('Spot').up()
     .ele('DeliveryMethod').txt('DEALID16').up()
     .up()
     .up()
     .end({ pretty: true});
     return body;
  }
  calculateAmount = async (event) => {
    try {
      let amount = parseInt(event.target.value.replace(/[^0-9]/g, ''), 10)
      if (amount) {
        if (amount > parseInt(this.state.balanceAccount, 10)) {
          return this.props.dispatch(updateSyncErrors('wizard', {
            'amount': 'Amount should not be greather than your current balance'
          }));
        }
        let body = this.buildXmlBody(amount);
        
        const response = await restService.proxyPost('/raterequest/', body);
        let xml = new XMLParser().parseFromString(response.data);
        let recipientAmount = xml.getElementsByTagName('IssueAmt')[0].value;

        await this.props.dispatch(change('wizard', 'recipientAmount', recipientAmount));
        this.props.wizard.values.rate = xml.getElementsByTagName('CurRate')[0].value;
        this.props.wizard.values.currencyAccount = this.state.currencyAccount;
        
        this.setState({ recipientAmount })
      }
    } catch (e) {
      console.log(e);
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
                { value: 'DOP', label: 'DOP' },
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
