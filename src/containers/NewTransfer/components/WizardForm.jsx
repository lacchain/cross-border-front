import React, { PureComponent } from 'react';
import { Col, Card, Row, Progress } from 'reactstrap';
import PropTypes from 'prop-types';
import WizardFormOne from './WizardFormOne';
import WizardFormTwo from './WizardFormTwo';
import WizardFormThree from './WizardFormThree';
import { web3Service } from '../../../services/web3Service';

web3Service.setUpWeb3Service();
export default class WizardForm extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      page: 1,
    };
  }

  nextPage = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  previousPage = () => {
    this.setState(prevState => ({ page: prevState.page - 1 }));
  };
  previousPage = () => {
    this.setState(prevState => ({ page: prevState.page - 1 }));
  };
  changeTransferData = () => {
    this.setState({ page: 1 });
  };
  changeRecipientData = () => {
    this.setState({ page: 2 });
  };
  render() {
    const { onSubmit, submitError } = this.props;
    const { page } = this.state;
    var progressStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '60%',
      marginTop: 60,
      marginBottom: 0
    };
    return (
      <Row>
        <Col md={ 12 } lg={ 12 }>
          <Card>
            <div className="wizard">
              {page !== 0 &&<div className="wizard__steps">
                <div className={ `wizard__step${page === 1 ? ' wizard__step--active' : ''}` }><p>1. AMOUNT</p></div>
                <div className={ `wizard__step${page === 2 ? ' wizard__step--active' : ''}` }><p>2. RECIPIENT</p></div>
                <div className={ `wizard__step${page === 3 ? ' wizard__step--active' : ''}` }><p>5. REVIEW</p></div>
              </div>}
              <div className="progress-wrap progress-wrap--middle" style={ progressStyle }>
                {page === 1 && <Progress value={ 33 } />}
                {page === 2 && <Progress value={ 66 } />}
                {page === 3 && <Progress value={ 100 } />}
              </div>
              <div className="wizard__form-wrapper">
                {page === 1 && <WizardFormOne {...this.props} previousPage={ this.previousPage } onSubmit={ this.nextPage } />}
                {page === 2
                  && (
                    <WizardFormTwo
                      previousPage={ this.previousPage }
                      onSubmit={ this.nextPage }
                    />
                  )}
                {page === 3
                  && (
                    <WizardFormThree
                    changeRecipientData={this.changeRecipientData}
                    changeTransferData={this.changeTransferData}
                    previousPage={ this.previousPage }
                    onSubmit={ onSubmit }
                    submitError={ submitError }
                    />
                  )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  }
}
