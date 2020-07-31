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
    error: false,
    loading: false,
  };
  componentDidUpdate = async () => {
    if (this.props.success.message || this.props.error.message) {
      this.props.history.push(`/pages/accounts/${localStorage.getItem('userDltAddress')}/details`);
      this.props.destroy('wizard');
    }
  }
  sendTransactions = async (values) => {
    this.setState({ loading: true });
    await web3Service.orderTransfer(values.recipientDltAddress, process.env.OPERATOR_ADDRESS, values.amount * 10000, values.rate * 10000)
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h3 className="page-title">Send cross-border payment</h3>
            <h3 className="page-subhead subhead">Go through all the four steps below to create a new cross border payment.
            </h3>
          </Col>
          <Col>
          </Col>
        </Row>
        <Wizard onSubmit={this.sendTransactions} {...this.props} submitError={this.state.error} loading={this.state.loading} />}
      </Container>
    );
  }
}

WizardForm.propTypes = {
  t: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  wizard: state.form.wizard,
  success: state.notification.success,
  error: state.notification.error,
});
const mapDispatchToProps = {
  destroy: destroy
};

const TransferForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(WizardForm);

export default withTranslation('common')(TransferForm);
