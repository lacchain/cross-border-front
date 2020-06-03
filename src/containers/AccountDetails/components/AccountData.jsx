import React, { PureComponent } from 'react';
import Panel from '../../../shared/components/Panel';
import AccountCircleOutlineIcon from 'mdi-react/AccountCircleOutlineIcon';

class AccountData extends PureComponent {
  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const dashboardStyle = {
      width: '50%',
      maxWidth: '200px',
      textAlign: 'left'
    }
    const containerStyle = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between'
    }
    const inlineStyle = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '10px'
    }
    const inlineStyle2 = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between',
      marginTop: '30px'
    }
    return (
      <Panel
        xl={6}
        lg={12}
        md={12}
        xs={12}
        panelClass={'lateral-panel-center'}
      >
        <div style={containerStyle}>
          <div style={dashboardStyle}>
            <AccountCircleOutlineIcon color={'grey'} size={60}></AccountCircleOutlineIcon>
            <p className="bold-text" style={{ fontSize: '18px' }}>{this.props.account.bankDetails.bankName}</p>
            <p>{this.props.account.accountDetails.fullname}</p>
            <p>{this.props.account.accountDetails.email}</p>
          </div>
          <div style={{ marginLeft: '30px', width: '50%', borderStyle: 'solid', borderColor: '#e1e1e1', height: 'fit-content' }}>
            <div style={inlineStyle}>
              <p>Bank:</p>
              <p className="bold-text-gray" style={{marginTop: '0px'}}>{this.props.account.bankDetails.bankName}</p>
            </div>
            <div style={inlineStyle}>
              <p>Bank Tax ID:</p>
              <p className="bold-text-gray" style={{marginTop: '0px'}}>{this.props.account.bankDetails.bankTaxId}</p>
            </div>
            <div style={inlineStyle}>
            <p>Bank City:</p>
            <p className="bold-text-gray" style={{marginTop: '0px'}}>{this.props.account.bankDetails.bankCity}</p>
          </div>
          <div style={inlineStyle}>
            <p style={{marginBottom: '10px'}}>Bank Account:</p>
            <p className="bold-text-gray" style={{marginTop: '0px', marginBottom: '10px'}}>{this.props.account.bankDetails.bankAccount}</p>
          </div>
          </div>
        </div>
      <div style={inlineStyle2}>
        <p>DLT Address:</p>
        <p className="bold-text-gray" style={{marginTop: '0px'}}>{this.props.account.accountDetails.dltAddress}</p>
      </div>
      </Panel >
    );
  }
}

export default AccountData;
