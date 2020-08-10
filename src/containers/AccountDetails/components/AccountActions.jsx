import React, { PureComponent } from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import Panel from '../../../shared/components/Panel';
import { web3Service } from '../../../services/web3Service';
import { Button, Modal, ButtonToolbar } from 'reactstrap';
import LoadingIcon from 'mdi-react/LoadingIcon';
import SendIcon from 'mdi-react/SendIcon';
import classNames from 'classnames';
import Select from 'react-select';
import { userService } from '../../../services/userService';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import inputHelper from '../../../services/inputHelper';
import { Field, reduxForm } from 'redux-form';
import renderField from '../renderField';
import { connect } from 'react-redux';

class AccountActions extends PureComponent {
  constructor() {
    super();
    this.state = {
      data: [{
        value: 100,
        fill: '#007697'
      }],
      status: '',
      account: {},
      balance: 0,
      load: false,
      mintModal: false,
      whitelistModal: false,
      whitelistCurrency: 'USD',
      amountToMint: ''
    };
  }

  componentDidMount = async () => {
    let status = this.props.account.accountDetails.status
    status = status.toLowerCase()
    let balance
    if (status !== 'inactive') {
      balance = await web3Service.emoneyBalanceOf(this.props.account.accountDetails.dltAddress, this.props.account.accountDetails.currency);
    } 
    if (!balance) {
      balance = this.props.account.accountDetails.balance
    }
    this.setState({ status, balance })

  };
  componentDidUpdate = async () => {
    if (this.props.success.message || this.props.error.message) {
      let balance = await web3Service.emoneyBalanceOf(this.props.account.accountDetails.dltAddress, this.props.account.accountDetails.currency);
      this.setState({ load: false, balance: balance })
    }
  }
  whitelistAccount = async () => {
    this.setState({ load: true })
    await web3Service.whitelistAccount(this.props.account.accountDetails.dltAddress, this.state.whitelistCurrency)
    this.setState({ whitelistModal: false })
  }
  mintMoney = async () => {
    this.setState({ load: true, mintModal: false })
    await web3Service.mintMoney(this.props.account.accountDetails.dltAddress, this.props.mint.values.amountToMint * 10000, this.props.account.accountDetails.currency)
    let balance = await web3Service.emoneyBalanceOf(this.props.account.accountDetails.dltAddress, this.props.account.accountDetails.currency);
    this.setState({ balance: balance })
  }
  openWhitelistModal = async () => {
    this.setState({ whitelistModal: true })
  }
  openMintModal = async () => {
    this.setState({ mintModal: true })
  }
  close = () => {
    this.setState({ mintModal: false, whitelistModal: false });
  }

  render() {
    const { load } = this.state;
    const currencyMask = createNumberMask({
      prefix: `${this.props.account.accountDetails.currency} `,
      decimalLimit: 2,
      allowDecimal: true,
    });
   
    const containerStyle = {
      width: '100%',
      marginTop: '100px'
    }
    const selectStyle = {
      marginRight: '50px',
      marginTop: '15px'
    }
    const expandClass = classNames({
      icon: true,
      expand: true,
      'expand--load': load,
    });
    return (
      <Panel
        xl={6}
        lg={12}
        md={12}
        xs={12}
        panelClass={'lateral-panel-center'}
      >
        <Modal
          centered
          isOpen={this.state.whitelistModal}
          toggle={this.close}
          className={`modal-dialog--primary modal-dialog--header`}
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.close} />
            {''}
            <h4 className="bold-text modal__title">Account whitelisting</h4>
          </div>
          <div className="modal__body">
            <h3 className="page-title" style={{ marginBottom: 0 }}></h3>
          </div>
          <form className="form form--vertical wizard__form">
            <div className="form__form-group-modal">
              <span className="form__form-group-label-detail bold-text">Select a currency for this account</span>
              <div className="form__form-group-field-detail inline-div" style={selectStyle} >
                <Select
                  name="currencyWhitelisting"
                  type="text"
                  onChange={e => {
                    this.setState({
                      whitelistCurrency: e.value,
                    });
                  }}
                  options={[
                    { value: 'USD', label: 'USD - Dollar' },
                    { value: 'DOP', label: 'DOP - Dominican Peso' },
                  ]}
                  placeholder="Select currency"
                />
              </div>
            </div>
          </form>
          <ButtonToolbar className="modal__footer">
            <Button onClick={this.close}>Cancel</Button>{' '}
            <Button outline={true} color={'primary'} className={expandClass} onClick={this.whitelistAccount}>
              <p><LoadingIcon />Whitelist</p></Button>
          </ButtonToolbar>
        </Modal>
        <Modal
          centered
          isOpen={this.state.mintModal}
          toggle={this.close}
          className={`modal-dialog--primary modal-dialog--header`}
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.close} />
            {''}
            <h4 className="bold-text modal__title">Money tokenization</h4>
          </div>
          <div className="modal__body">
            <h3 className="page-title" style={{ marginBottom: 0 }}></h3>
          </div>
          <form className="form form--vertical wizard__form">
            <div className="form__form-group-modal">
              <span className="form__form-group-label-detail bold-text">Input amount to tokenize</span>
              <div className="form__form-group-field-detail" style={selectStyle} >
                <Field
                  name="amountToMint"
                  component={renderField}
                  type="input"
                  onChange={e => {
                    console.log(e)
                    this.setState({
                      amountToMint: e.target.value,
                    });
                  }}
                  placeholder="Enter amount"
                  mask={currencyMask}
                  normalize={inputHelper.normalize}
                />
              </div>
            </div>
          </form>
          <ButtonToolbar className="modal__footer">
            <Button onClick={this.close}>Cancel</Button>{' '}
            <Button outline={true} color={'primary'} className={expandClass} onClick={this.mintMoney}>
              <p><LoadingIcon />Tokenize</p></Button>
          </ButtonToolbar>
        </Modal>
        <div style={containerStyle}>
          {this.state.status == 'active' &&<div style={{ marginLeft: '30px' }}>
              <p className="bold-text" style={{ fontSize: '22px' }}>Account balance</p>
              <p className="bold-text" style={{ fontSize: '22px' }}>{this.props.account.accountDetails.currency} {inputHelper.formatNumber(this.state.balance)}</p>
            </div>}
            {(this.state.status != 'active' && !userService.isCiti()) && <p className="bold-text" style={{ fontSize: '22px' }}>Account waiting for whitelisting</p>}
            {(this.state.status != 'active' && userService.isCiti()) && <p className="bold-text" style={{ fontSize: '22px' }}>User account waiting for whitelisting</p>}
            {userService.isCiti() ?
              <div>
                {this.state.status !== 'active' ? <Button style={{ marginBottom: 0, width: '100%', marginTop: '30px' }} className={expandClass} color="primary" size="sm" onClick={this.openWhitelistModal}>
                  <p style={{ display: 'block' }}><LoadingIcon />WHITELIST ACCOUNT</p>
                </Button> :
                  <Button style={{ marginBottom: 0, width: '100%', marginTop: '30px' }} className={expandClass} color="primary" size="sm" onClick={this.openMintModal}>
                    <p style={{ display: 'block' }}><LoadingIcon />TOKENIZE MONEY</p>
                  </Button>}
              </div> :
              (this.state.balance > 0 && this.state.status =='active')  &&<Button style={{ marginBottom: 0, width: '100%', marginTop: '30px' }} color="primary" size="sm" onClick={() => this.props.history.push('/pages/new-transfer')} disabled={this.state.status === 'inactive'}>
                <p style={{ display: 'block' }}>SEND MONEY <SendIcon style={{ marginTop: '0px', marginLeft: '10px' }} /></p>
              </Button>}
          </div>
      </Panel>
    );
  }
}

const mapStateToProps = state => ({
  mint: state.form.mint,
  success: state.notification.success,
  error: state.notification.error,
});

const AccountActionsComponent = connect(
  mapStateToProps,
  null
)(AccountActions);

export default reduxForm({
  form: 'mint', //                 <------ same form name
  destroyOnUnmount: true, //        <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(AccountActionsComponent);
