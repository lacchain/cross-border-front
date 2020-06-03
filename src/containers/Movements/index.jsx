import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import MovementsTable from './components/MovementsTable';

export default class Movements extends PureComponent {
  render() {
    return (
      <Col md={ 12 } lg={ 12 }>
        <Row>
          <Col>
            <h3 className="page-title">Movements</h3>
            <h3 className="page-subhead subhead">Manage all movements in the platform</h3>
          </Col>
          <Col>
            <div className="breadcrumbs"><span className='breadcrumbs__current'>MOVEMENTS</span></div>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row>
              <Col md={ 12 }>
                <div className="card__title">
                  <h5 className="bold-text">CROSS-BORDER MOVEMENTS</h5>
                </div>
              </Col>
            </Row>           
            <MovementsTable { ...this.props } />
          </CardBody>
        </Card>
      </Col>
    );
  }
}
