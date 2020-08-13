import React, { PureComponent } from 'react';
import Panel from '../../../shared/components/Panel';
import { web3Service } from '../../../services/web3Service';
import classNames from 'classnames';
import LoadingIcon from 'mdi-react/LoadingIcon';
import { Button } from 'reactstrap';

class AccountData extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
      timer: null,
      status: ''
    };
  }
  componentDidMount = async () => {
    this.getStatus()
  };
  getStatus = async () => {
    let status = this.props.account.accountDetails.status
    status = status.toLowerCase()
    this.setState({ status })
  }
  componentDidUpdate = async (prevProps) => {
    if (this.props != prevProps) {
      this.getStatus();
    }
  }
  cancelAccount = async () => {
    this.setState({ loading: true })
    await web3Service.cancelAccount(this.props.account.accountDetails.dltAddress, this.props.account.accountDetails.currency)
    this.setState({ loading: false })
    let timer = setInterval(()=> this.props.getAccount(), process.env.POLLING_TIMER);
    this.setState({ timer })
  }
  componentWillReceiveProps = (prevProps) => {
    if(this.props.account.accountDetails.status != prevProps.account.accountDetails.status) {
      clearInterval(this.state.timer);
      this.setState({ timer: null});  
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({ timer: null});
  }
  render() {
    const expandClass = classNames({
      icon: true,
      expand: true,
      'expand--load': this.state.loading,
    });
    const dashboardStyle = {
      width: '100%',
      textAlign: 'left'
    }
    const containerStyle = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between'
    }
    const valueStyle = {
      marginTop: '0px',
      marginLeft: '15px',
      maxWidth: '350px'
    }
    const titleStyle = {
      width: '100px',
    }
    const inlineStyle = {
      display: 'inline-flex',
      width: '100%',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '10px'
    }
    const buttonStyle = {
      height: '30px',
      padding: '0px',
      paddingRight: '5px',
      marginTop: '10px',
      marginBottom: '0px !important',
    }
    return (
      <Panel
        xl={6}
        lg={12}
        md={12}
        xs={12}
        panelClass={'lateral-panel-center'}
      >
        <div style={ {textAlign: 'right', marginTop: '-20px'} }>
          <div className={`badge badge-${this.state.status}`}>{this.state.status}</div>
        </div>
        <div style={containerStyle}>
          <div style={dashboardStyle}>
            <div style={inlineStyle}>
              <p style={titleStyle}>Name:</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.accountDetails.fullname}</p>
            </div>
            <div style={inlineStyle}>
              <p style={titleStyle}>Company:</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.accountDetails.company}</p>
            </div>
            <div style={inlineStyle}>
              <p style={titleStyle}>Email:</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.accountDetails.email}</p>
            </div>
            <div style={inlineStyle}>
              <p style={titleStyle}>DLT address</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.accountDetails.dltAddress}</p>
            </div>
            <div style={inlineStyle}>
              <p style={titleStyle}>Bank:</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.bankDetails.bankName}</p>
            </div>
            <div style={inlineStyle}>
              <p style={titleStyle}>Bank Tax ID:</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.bankDetails.bankTaxId}</p>
            </div>
            <div style={inlineStyle}>
              <p style={titleStyle}>Bank City:</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.bankDetails.bankCity}</p>
            </div>
            <div style={inlineStyle}>
              <p style={titleStyle}>Bank Account:</p>
              <p className="bold-text-gray" style={valueStyle}>{this.props.account.bankDetails.bankAccount}</p>
            </div>            
          <Button style={buttonStyle} color={'danger'} className={expandClass} onClick={this.cancelAccount} disabled={this.state.status != 'active'}>
              <p><LoadingIcon />Cancel account</p></Button>
          </div>
        </div>
      </Panel >
    );
  }
}

export default AccountData;
