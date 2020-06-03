import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import AccountsTable from './components/AccountsTable';

export default class Accounts extends PureComponent {
  render() {
    return (
      <Col md={ 12 } lg={ 12 }>
        <Row>
          <Col>
            <h3 className="page-title">Accounts</h3>
            <h3 className="page-subhead subhead">Manage all accounts in the platform</h3>
          </Col>
          <Col>
            <div className="breadcrumbs"><span className='breadcrumbs__current'>ACCOUNTS</span></div>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row>
              <Col md={ 12 }>
                <div className="card__title">
                  <h5 className="bold-text">ACCOUNTS</h5>
                </div>
              </Col>
            </Row>           
            <AccountsTable { ...this.props } />
          </CardBody>
        </Card>
      </Col>
    );
  }
}
