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
      movements: null,
      timer: null
    };
  }
  
  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({ timer: null});
  }
  componentDidMount = async () => {
    this.getMovements()
    this.getAccount()

    let timer = setInterval(()=> this.getMovements(), process.env.POLLING_TIMER);
    this.setState({ timer })
  };
  getAccount = async () => {
    let account;
    let responseAccount;

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
        this.setState({ account });
      }

    } catch (e) {
      this.setState({ account: {} });
    }
  }

  getMovements = async () => {
    const { match: { params: { accountId } } } = this.props;

    let responseMovements;
    let movements;
    try {
      if (userService.isCiti()) {
        responseMovements = await restService.get(`/api/account/${accountId}/movements`);
      } else {
        responseMovements = await restService.get(`/api/account/movements`);
      }
      
      movements = responseMovements.data;
      this.setState({ movements });

    } catch (e) {
      this.setState({ movements: {} });
    }
  }
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
          <AccountData getAccount={this.getAccount} account={this.state.account} {...this.props} showModal={this.showModal} />
          <AccountActions getAccount={this.getAccount} account={this.state.account} {...this.props} />
        </Row>
        <Row>
          <AccountMovements movements={this.state.movements} account={this.state.account} {...this.props} />
        </Row>
      </Container>
    );
  }
}

export default AccountDetails;
