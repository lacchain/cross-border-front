import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Row, Button, ButtonToolbar } from 'reactstrap';
import PropTypes from 'prop-types';
import restService from '../../services/restService';
import { userService } from '../../services/userService';
import CloseCircleOutlineIcon from 'mdi-react/CloseCircleOutlineIcon';

class MovementDetails extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      modal: false,
      movement: {}
    };
  }

  componentDidMount = async () => {
    let movement;

    const { match: { params: { movementId } } } = this.props;
    const { history } = this.props;

    try {
      const response = await restService.get(`/api/account/movements/${movementId}`);
      if (response === 403) {
        return history.push('/pages/accounts');
      }

      if (response === 404) {
        history.push('/404');
      } else {
        movement = response.data;
        this.setState({ movement });
      }

    } catch (e) {
      this.setState({ movement: {} });
    }
  };

  approveTransfer = () => {
    alert('approve')
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    const inlineStyle = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '15px'
    }
    const inlineStyleParent = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingTop: '20px',
      paddingBottom: '10px'
    }

    let subtitle = {
      color: '#999999',
      fontSize: 13,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 20,
      marginTop: 20,
      textAlign: 'center'
    };
    return (
      <Col md={12} lg={12}>
        <Row>
          <Col>
            <h3 className="page-title">Movements details</h3>
            <h3 className="page-subhead subhead">Manage all movements in the platform</h3>
          </Col>
          <Col>
          
            <div className="breadcrumbs"><CloseCircleOutlineIcon size={50} onClick={this.goBack}></CloseCircleOutlineIcon></div>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
                {this.state.movement.transferDetails &&
                <form className="form form--horizontal wizard__form">
                  <h3 className="wizard__title">Cross border transfer</h3>
                  <h4 style={subtitle} className="gray text-center">Operation ID {this.state.movement.operationId}</h4>
                  <div style={{ width: '100%', textAlign: 'center', marginBottom: '30px' }}>
                    <div className={`badge badge-${this.state.movement.status.toLowerCase().replace(/\s/g,'')}`}>{this.state.movement.status.toLowerCase()}</div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <ButtonToolbar className="form__button-toolbar wizard__toolbar" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
                      <Button type="button" className="previous" onClick={this.goBack}>Back</Button>
                      {(userService.isCiti() && this.state.movement.status === "Requested") &&<Button color="primary" type="submit" onClick={this.approveTransfer}>Approve operation</Button>}
                    </ButtonToolbar>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ width: '500px', margin: 'auto', borderStyle: 'solid', borderColor: '#e1e1e1', height: 'fit-content' }}>
                    <h4 className="wizard__title" style={{marginTop: '20px', marginBottom: '10px'}}>Movement details</h4>
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Transfer details</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Sent amount</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px', fontSize: '18px' }}>{this.state.movement.transferDetails.amountSent + ' ' + this.state.movement.transferDetails.senderCurrency}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Fee aplied</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.feeApplied + ' ' + this.state.movement.transferDetails.senderCurrency}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Converted amount</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.amountConverted + ' ' + this.state.movement.transferDetails.receiverCurrency}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Rate applied</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.rateApplied}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Recipient will get</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.totalAmount} {this.state.movement.currency}</p>
                      </div>
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Sender details</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Name</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.name}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.bank}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank account</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.bankAccount}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">DLT address</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.dltAddress}</p>
                      </div>
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Recipient details</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Name</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.name}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.bank}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank account</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.bankAccount}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text" style={{ marginBottom: '10px' }}>DLT address</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.dltAddress}</p>
                      </div>
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Movement history</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Operation requested</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.transactionHistory.operationRequested}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Set fee</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.transactionHistory.setFee}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Operation approved</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px' }}>{this.state.movement.transactionHistory.operationApproved}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text" style={{ marginBottom: '10px' }}>DLT address</p>
                        <p className="bold-text-gray" style={{ marginTop: '0px', marginBottom: '10px' }}>{process.env.CROSSBORDER_ADDRESS}</p>
                      </div>
                    </div>
                  </div>
                </form >}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default MovementDetails;