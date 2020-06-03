import React, { PureComponent } from 'react';
import { Col, Container, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import AccountData from './components/AccountData';
import AccountActions from './components/AccountActions';
import AccountMovements from './components/AccountMovements';
import restService from '../../services/restService';
import { userService } from '../../services/userService';

class AccountDetails extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      account: {},
      modal: false,
      movements: null
    };
  }

  componentDidMount = async () => {
    let account;
    let movements;
    let responseAccount;
    let responseMovements;

    const { match: { params: { accountId } } } = this.props;
    const { history } = this.props;

    try {
      if (userService.isCiti()) {
        responseAccount = await restService.get(`/api/user/${accountId}`);
      } else {
        responseAccount = await restService.get(`/api/user`);
      }

      if (responseAccount === 403) {
        return history.push('/pages/accounts');
      }

      if (responseAccount === 404) {
        history.push('/404');
      } else {
        account = responseAccount.data;
      }

    } catch (e) {
      this.setState({ account: {} });
    }

    try {
      if (userService.isCiti()) {
        responseMovements = await restService.get(`/api/account/${accountId}/movements`);
      } else {
        responseMovements = await restService.get(`/api/account/movements`);
      }
      
      movements = responseMovements.data;
      this.setState({ account, movements });

    } catch (e) {
      this.setState({ movements: {} });
    }
  };

  render() {
    if (!this.state.account.accountDetails) {
      return (<div></div>);
    }

    return (
      <Container className="dashboard">
        <Row>
          <Col>
            <h3 className="page-title">Account Details</h3>
          </Col>
          <Col>
            <div className="breadcrumbs">
              <span className='breadcrumbs' onClick={() => this.props.history.push('/pages/accounts')}>Accounts / </span><span className='breadcrumbs__current'>Account details</span>
            </div>
          </Col>
        </Row>
        <Row>
          <AccountActions account={this.state.account} {...this.props} />
          <AccountData account={this.state.account} {...this.props} showModal={this.showModal} />
        </Row>
        <Row>
          <AccountMovements movements={this.state.movements} account={this.state.account} {...this.props} />
        </Row>
      </Container>
    );
  }
}

export default AccountDetails;
