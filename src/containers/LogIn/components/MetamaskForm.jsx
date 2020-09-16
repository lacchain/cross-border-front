import React, { PureComponent } from 'react';
import {  reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import validate from './validate';
import { withTranslation } from 'react-i18next';
import { web3Service } from '../../../services/web3Service';
import { MetaMaskButton } from "rimble-ui";
import { Button, Modal, ButtonToolbar } from 'reactstrap';
const step1 = `${process.env.PUBLIC_URL}/img/step1.png`;
const step2 = `${process.env.PUBLIC_URL}/img/step2.png`;
const step3 = `${process.env.PUBLIC_URL}/img/step3.png`;

var detect = require("detect-browser").detect;

const metamask = `${process.env.PUBLIC_URL}/img/metamask.png`;
var isMobile;
var path = window.location.href;
const renderField = ({
  input, placeholder, type, meta: { touched, error },
}) => (
    <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
      <input {...input} placeholder={placeholder} type={type} />
      {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
  );

renderField.propTypes = {
  input: PropTypes.shape().isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

renderField.defaultProps = {
  placeholder: '',
  meta: null,
  type: 'text',
};

class MetamaskForm extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
      email: '',
      password: '',
      visibleLoginError: false,
      isLoginMetaMask: false,
      isDesiredNetwork: false,
      isLogin: false,
      modal: false,
    };
  }
  componentWillMount() {
    this.checkMetamask()
  }
  checkMetamask = () => {
    if (typeof web3 !== "undefined") {
      this.setState({install: false})
      window.ethereum.on("networkChanged", network => {
        if (network === process.env.DLT_NETWORKS) {
          this.setState({
            isLogin: true,
            isDesiredNetwork: true,
            isLoginMetaMask: true
          });
        } else {
          this.setState({
            isLogin: false,
            isDesiredNetwork: false,
            isLoginMetaMask: false
          });
        }
      });
    } else {
      this.setState({install: true})
    }
  }
  componentDidMount = () => {
    localStorage.removeItem('user');
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.setState({ visibleLoginError: false });
  };

  onShowLoginError = () => this.setState({ visibleLoginError: true });

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  };

  checkNetwork() {
    // If a web3 instance is already provided by Meta Mask.
    if (window.ethereum.networkVersion === process.env.DLT_NETWORKS) {
      localStorage.setItem('userDltAddress', window.web3.eth.defaultAccount);
      this.setState({ isLogin: true, isDesiredNetwork: true });
      window.location.reload();
     } 
  }
  
  async init() {
    try {
      await window.ethereum.enable();
      this.setState({
        isDesiredNetwork: false,
        isLoginMetaMask: true
      });
      this.checkNetwork();
    } catch (error) {
      this.setState({ isLoginMetaMask: false});
    }
    window.ethereum.on("accountsChanged", accounts => {
      localStorage.setItem('userDltAddress', window.web3.eth.defaultAccount);
      if (accounts.length === 1) {
        this.setState({
          isLoginMetaMask: true,
          isLogin: false
        });
        this.init();
      } else {
        this.setState({
          isLoginMetaMask: false,
          isLogin: true
        });
      }
    });
  }
  openMetamask = () => {
    this.setState({ modal: true });
  }
  handleMetamask = () => {
    if (typeof web3 !== "undefined") {
      this.init();
    } else {
      setTimeout(window.location.reload(), 3000);

      const browser = detect();

      isMobile = !!detectMobile();

      function detectMobile() {
        return (
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i)
        );
      }
      if (!isMobile) {
       if (web3Service.isMetamaskInstalled()) {
        window.open("http://fwd.metamask.io/ ?" + path);
       }

        switch (browser.name) {
          case "firefox":
            window.open(
              "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/",
              "_blank"
            );

            break;

          case "chrome":
            window.open(
              "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
              "_blank"
            );
            break;

          case "opera":
            window.open(
              "https://addons.opera.com/en/extensions/details/metamask/",
              "_blank"
            );

            break;
        }
      }
    }
  }
  close = () => {
    this.setState({ modal: false });
  }
  render() {
    var imageStyle = {
      width: '93px',
      height: '87px',
      margin: '40px'
    };

    var buttonStyle = {
      marginTop: '20px'
    };

    var textStyle = {
      fontSize: '16px',
      lineHeight: '27px',
      color: '#9d9d9d'
    };

    var divStyle = {
      marginTop: '15px'
    };

    var divImageStyle = {
      justifyContent: 'center',
      marginTop: 10
    };

    var step1Style = {
      width: '301px',
      height: '45px',
      display: 'block',
      margin: 'auto',
    };
    var step2Style = {
      width: '301px',
      height: '146px',
      display: 'block',
      margin: 'auto',
    };
    var step3Style = {
      width: '301px',
      height: '146px',
      display: 'block',
      margin: 'auto',
    };
    return (
      <div>
      <div className="account__head">
          <h3 className="account__title">Welcome to
            <span className="account__logo"> LACChain
              <span className="account__logo-accent">CrossBorder</span>
            </span>
          </h3>
          <h4 className="account__subhead subhead text-center">Cross border payments using blockchain</h4>
        </div>
      <div className="text-center">
        <img alt="" style={imageStyle} src={metamask}></img>
        <h4 className="text-center" style={textStyle}>Please make sure you are connected on metamask with an account in the <a class="text-link" href="">LACChain network. </a></h4>
            <Modal
              centered
              isOpen={this.state.modal}
              width={800}
              toggle={this.close}
              className={`modal-dialog--primary modal-dialog--header big-modal`}
            >
              <div className="modal__header">
                <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.close} />
                {''}
                <h4 className="bold-text modal__title">Connect to LACChain</h4>
              </div>
              <div className="modal__body" style={{ marginLeft: 20 }}>
                <h3 className="page-title" style={{ marginBottom: 0 }}></h3>
                <span>To use the  application, you will need to connect metamask to LACChain network firs.</span><br/>
                <span>Follow the next steps:</span>
                <div style={ divStyle }>
                  <span className="bold-text-gray2">1. Open your Metamask browser extension, usually found in the top right corner of your browser.</span>
                  <div style={divImageStyle}>
                    <img alt="" style={step1Style} src={step1}></img>
                  </div>
                </div>
                <div style={ divStyle }>
                  <span className="bold-text-gray2">2. Click on the "Networks "selector on the top, and select "Custom RPC".</span>
                  <div style={divImageStyle}>
                    <img alt="" style={step2Style} src={step2}></img>
                  </div>
                </div>
                <div style={ divStyle }>
                  <span className="bold-text-gray2">3. Add the network name ("LACChain") and the new RPC url: "{process.env.NODE_URL}". Click save.</span>
                  <div style={divImageStyle}>
                    <img alt="" style={step3Style} src={step3}></img>
                  </div>
                </div>
                <div style={ divStyle }>
                  <span className="bold-text-gray2">4. Now on the "Networks" selector at the top, make sure you have "LACChain" selected.</span>
                </div>
              </div>
              <ButtonToolbar className="modal__footer footer_right">
                <Button colored={true} color={'primary'} onClick={this.close}>Close</Button>
              </ButtonToolbar>
            </Modal>
        {!this.state.isLoginMetaMask &&<MetaMaskButton style={buttonStyle} mb={3} onClick={this.handleMetamask}>
          {!web3Service.isMetamaskInstalled() ? "Install MetaMask" : "Connect to Metamask"}
        </MetaMaskButton>}
        {(!this.state.isDesiredNetwork && this.state.isLoginMetaMask) &&
        <MetaMaskButton style={buttonStyle} mb={3} onClick={this.openMetamask}>
        Connect to LACChain
      </MetaMaskButton>}
      </div>
      </div>
    );
  }
}
export default reduxForm({
  form: 'horizontal_form_validation_metamask', // a unique identifier for this form
  validate,
})(withTranslation('common')(MetamaskForm));
