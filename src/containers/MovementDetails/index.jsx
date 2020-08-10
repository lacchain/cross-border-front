import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Row, Button, ButtonToolbar } from 'reactstrap';
import PropTypes from 'prop-types';
import restService from '../../services/restService';
import { userService } from '../../services/userService';
import CloseCircleOutlineIcon from 'mdi-react/CloseCircleOutlineIcon';
import { web3Service } from '../../services/web3Service';
import classNames from 'classnames';
import LoadingIcon from 'mdi-react/LoadingIcon';
import { connect } from 'react-redux';

class MovementDetails extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      modal: false,
      movement: {},
      loading: false
    };
  }
  componentDidUpdate = async () => {
    if (this.props.success.message || this.props.error.message) {
      this.props.history.push('pages/movements')
    }
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

  approveTransfer = async () => {
    this.setState({ loading: true });
    await web3Service.approveTransfer(this.state.movement.operationId)
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    const inlineStyle = {
      display: 'inline-flex',
      width: '100%',
      justifyContent: 'space-between',
      paddingLeft: '30px',
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

    const expandClass = classNames({
      icon: true,
      expand: true,
      'expand--load': this.state.loading,
    });

    return (
      <Col md={12} lg={12}>
        <Row>
          <Col>
            <h3 className="page-title">Movements details</h3>
            <h3 className="page-subhead subhead">Manage all movements in the platform</h3>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
              <div className="breadcrumbs"><CloseCircleOutlineIcon size={50} onClick={this.goBack}></CloseCircleOutlineIcon></div>
                {this.state.movement.transferDetails &&
                <form className="form form--horizontal wizard__form" style={{padding: '20px'}}>
                  <h3 className="wizard__title">Cross border transfer</h3>
                  <div style={{ width: '100%', textAlign: 'center', marginBottom: '30px' }}>
                    <div className={`badge badge-${this.state.movement.status.toLowerCase().replace(/\s/g,'')}`}>{this.state.movement.status.toLowerCase()}</div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <ButtonToolbar className="form__button-toolbar wizard__toolbar" style={{ display: 'block', textAlign: 'center', margin: '0px' }}>
                      {(userService.isCiti() && this.state.movement.status.toLowerCase() === "requested") && <Button color={'primary'} className={expandClass} onClick={this.approveTransfer}>
                      <p><LoadingIcon />Approve transfer</p></Button>}
                    </ButtonToolbar>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div style={{ width: '700px', margin: 'auto', borderStyle: 'solid', borderColor: '#e1e1e1', height: 'fit-content' }}>
                    <h4 className="wizard__title" style={{marginTop: '20px', marginBottom: '10px'}}>Movement details</h4>
                      <div>
                        <div style={inlineStyleParent}>
                          <p className="bold-text">Tracking information</p>
                        </div>
                        <div style={inlineStyle}>
                          <p className="gray">Operation ID: {this.state.movement.operationId}</p>
                        </div>
                        {this.state.movement.endtoendId && <div style={inlineStyle}>
                          <p className="gray">End to end ID: {this.state.movement.endtoendId}</p>
                        </div>}
                        {this.state.movement.apimguid && <div style={inlineStyle}>
                          <p className="gray">Apimgu ID: {this.state.movement.apimguid}</p>
                        </div>}
                      </div>
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Transfer details</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Sent amount</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.amountSent + ' ' + this.state.movement.transferDetails.senderCurrency}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Fee aplied</p>
                        {/* <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.feeApplied + ' ' + this.state.movement.transferDetails.senderCurrency}</p> */}
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>N/A</p>
                      </div>
                      {/* <div style={inlineStyle}>
                        <p className="review-wizard-text">Converted amount</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.amountConverted + ' ' + this.state.movement.transferDetails.receiverCurrency}</p>
                      </div> */}
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Rate applied</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.rateApplied}
                          {this.state.movement.status.toLowerCase() === 'requested' && <span className="bold-text-gray-big"> (estimated)</span>}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Recipient will get</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.transferDetails.totalAmount} {this.state.movement.currency}
                        {this.state.movement.status.toLowerCase() === 'requested' && <span className="bold-text-gray-big"> (estimated)</span>}</p>
                      </div>
                      {this.state.movement.senderDetails &&
                      <div>
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Sender details</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Name</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.name}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.bank}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank account</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.bankAccount}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">DLT address</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.senderDetails.dltAddress}</p>
                      </div>
                      </div>}
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Recipient details</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Name</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.name}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.bank}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text">Bank account</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.bankAccount}</p>
                      </div>
                      <div style={inlineStyle}>
                        <p className="review-wizard-text" style={{ marginBottom: '10px' }}>DLT address</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>{this.state.movement.recipientDetails.dltAddress}</p>
                      </div>
                      <div style={inlineStyleParent}>
                        <p className="review-wizard-title-text">Movement history</p>
                      </div>
                      {this.state.movement.transactionHistory.operationRequested && <div style={inlineStyle}>
                        <p className="review-wizard-text">Operation requested</p>
                        <a className='text-link-big' target="_blank" href={`https://explorer.lacchain.net/tx/${this.state.movement.transactionHistory.operationRequested}`} style={{ marginTop: '0px' }}>{this.state.movement.transactionHistory.operationRequested}</a>
                      </div>}
                      {/* <div style={inlineStyle}>
                        <p className="review-wizard-text">Set fee</p>
                        <p className="bold-text-gray-big" style={{ marginTop: '0px' }}>N/A</p>
                      </div> */}
                      {this.state.movement.transactionHistory.operationApproved && <div style={inlineStyle}>
                        <p className="review-wizard-text">Operation approved</p>
                        <a className='text-link-big' target="_blank" href={`https://explorer.lacchain.net/tx/${this.state.movement.transactionHistory.operationApproved}`} style={{ marginTop: '0px' }}>{this.state.movement.transactionHistory.operationApproved}</a>
                      </div>}
                      {this.state.movement.transactionHistory.operationExecuted && <div style={inlineStyle}>
                        <p className="review-wizard-text">Operation executed</p>
                        <a className='text-link-big' target="_blank" href={`https://explorer.lacchain.net/tx/${this.state.movement.transactionHistory.operationExecuted}`}  style={{ marginTop: '0px', marginBottom: '10px' }}>{this.state.movement.transactionHistory.operationExecuted}</a>
                      </div>
                      }
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
const mapStateToProps = state => ({
  success: state.notification.success,
  error: state.notification.error,
});

const MovementDetailsComponent = connect(
  mapStateToProps,
  null
)(MovementDetails);

export default MovementDetailsComponent;