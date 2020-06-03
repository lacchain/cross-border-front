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
    balance = await web3Service.emoneyBalanceOf(this.props.account.accountDetails.dltAddress, this.props.account.accountDetails.currency);
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
    await web3Service.mintMoney(this.props.account.accountDetails.dltAddress, this.props.mint.values.amountToMint * 100, this.props.account.accountDetails.currency)
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
    const dashboardStyle = {
      width: '50%',
      maxWidth: '200px'
    }
    const containerStyle = {
      display: 'inline-flex',
      width: '100%'
    }
    const inlineStyle = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between'
    }
    const inlineStyle2 = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between',
      marginTop: '20px'
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
                    { value: 'MXN', label: 'MXN - Mexican Peso' },
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
          <div className="dashboard__health-chart" style={dashboardStyle}>
            <ResponsiveContainer height={180}>
              <PieChart>
                <Pie data={this.state.data} dataKey="value" cy={85} innerRadius={80} outerRadius={90} />
              </PieChart>
            </ResponsiveContainer>
            <div className="dashboard__health-chart-info">
              <p className="dashboard__health-chart-number bold-text-blue">{this.props.account.accountDetails.currency}</p>
              <p className="dashboard__health-chart-units bold-text-blue">ACCOUNT</p>
            </div>
          </div>
          <div style={{ marginLeft: '30px' }}>
            <div style={inlineStyle}>
              <p className="bold-text" style={{ fontSize: '18px' }}>ACCOUNT BALANCE</p>
              <div className={`badge badge-${this.state.status}`}>{this.state.status}</div>
            </div>
            <div style={inlineStyle2}>
              <p className="bold-text" style={{ fontSize: '46px' }}>{this.state.balance}</p>
              <p className="bold-text" style={{ fontSize: '26px', marginTop: '15px' }}>{this.props.account.accountDetails.currency}</p>
            </div>
            {userService.isCiti() ?
              <div>
                {this.state.status === 'requested' ? <Button style={{ marginBottom: 0, width: '100%', marginTop: '30px' }} className={expandClass} color="primary" size="sm" onClick={this.openWhitelistModal}>
                  <p style={{ display: 'block' }}><LoadingIcon />WHITELIST ACCOUNT</p>
                </Button> :
                  <Button style={{ marginBottom: 0, width: '100%', marginTop: '30px' }} className={expandClass} color="primary" size="sm" onClick={this.openMintModal}>
                    <p style={{ display: 'block' }}><LoadingIcon />TOKENIZE MONEY</p>
                  </Button>}
              </div> :
              <Button style={{ marginBottom: 0, width: '100%', marginTop: '30px' }} color="primary" size="sm" onClick={() => this.props.history.push('/pages/new-transfer')}>
                <p style={{ display: 'block' }}>SEND MONEY <SendIcon style={{ marginTop: '0px', marginLeft: '10px' }} /></p>
              </Button>}
          </div>
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
