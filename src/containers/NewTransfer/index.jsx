import React, { Component } from 'react';
import { Button, ButtonToolbar, Col, Container, Modal, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Wizard from './components/WizardForm';
import { connect } from 'react-redux';
import { destroy } from 'redux-form';
import { web3Service } from '../../services/web3Service';

class WizardForm extends Component {
  state = {
    modal: false,
    type: false,
    error: false
  };

  componentDidMount = () => {
    if (this.props.wizard && this.props.wizard.values) {
      this.setState({ type: false });
    }
  };

  sendTransactions = async (values) => {
    await web3Service.orderTransfer(values.recipientDltAddress, '0x8b80bd08affe347e3f70e4a53ac2a5ca3384d824', values.amount)
    this.open()
  }

  onFinish = () => {
    this.props.history.push(`/pages/accounts/${localStorage.getItem('userDltAddress')}/details`);
    this.props.destroy('wizard');

    this.close();
  }

  close = () => {
    this.setState({ modal: false });
  }

  open = () => {
    this.setState({ modal: true });
  }

  start = () => {
    this.setState({ type: false });
  }

  render() {
    return (
      <Container>
        <Modal
          isOpen={this.state.modal}
          toggle={this.close}
          className={'modal-dialog--success'}
          centered={true}
          backdrop='static'
        >
          <div className="modal__header">
            <span className="lnr lnr-thumbs-up modal__title-icon" />
            <h4 className="bold-text  modal__title">Congratulations!</h4>
          </div>
          <div className="modal__body">
            Your payment is now being created on the DLT.<br />
            This process will take a few seconds.
          </div>
          <ButtonToolbar className="modal__footer">
            <Button color='success' onClick={this.onFinish}>Back to my account</Button>
          </ButtonToolbar>
        </Modal>
        <Row>
          <Col>
            <h3 className="page-title">Send cross-border payment</h3>
            <h3 className="page-subhead subhead">Go through all the four steps below to create a new cross border payment.
            </h3>
          </Col>
          <Col>
            
          </Col>
        </Row>
        {!this.state.type && <Wizard onSubmit={this.sendTransactions} {...this.props} submitError={this.state.error} />}
      </Container>
    );
  }
}

WizardForm.propTypes = {
  t: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  wizard: state.form.wizard
});
const mapDispatchToProps = {
  destroy: destroy
};

const TransferForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(WizardForm);

export default withTranslation('common')(TransferForm);
