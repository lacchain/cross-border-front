import React, { PureComponent } from 'react';
import {  reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import validate from './validate';
import { withTranslation } from 'react-i18next';
import { web3Service } from '../../../services/web3Service';
import { MetaMaskButton } from "rimble-ui";
import Modal from '../../../shared/components/Modal';

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

  network() {
    // If a web3 instance is already provided by Meta Mask.
    if (window.ethereum.networkVersion === process.env.DLT_NETWORKS) {
      localStorage.setItem('userDltAddress', window.web3.eth.defaultAccount);
      this.setState({ isLogin: true, isDesiredNetwork: true });
     } 
  }
  async init() {
    try {
      await window.ethereum.enable();
      this.setState({
        isDesiredNetwork: false,
        isLoginMetaMask: true
      });
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

    return (
      <div className="text-center">
        <img alt="" style={imageStyle} src={metamask}></img>
        <h4 className="text-center" style={textStyle}>Please make sure you are connected on metamask with an account in the <a class="text-link" href="">LACchain network. </a></h4>
        <Modal
              color="warning"
              title="Attention!"
              message="You have to open Metamask extension and select Pantheon network in the dropdown"
              modal = { this.state.modal }
              toggle = { this.close }
              centered={ true }
            />
        {!this.state.isLoginMetaMask &&<MetaMaskButton style={buttonStyle} mb={3} onClick={this.handleMetamask}>
          {!web3Service.isMetamaskInstalled() ? "Install MetaMask" : "Connect to Metamask"}
        </MetaMaskButton>}
        {(!this.state.isDesiredNetwork && this.state.isLoginMetaMask) &&
        <MetaMaskButton style={buttonStyle} mb={3} onClick={this.openMetamask}>
        Connect to LaCChain
      </MetaMaskButton>}
      </div>
    );
  }
}
export default reduxForm({
  form: 'horizontal_form_validation_metamask', // a unique identifier for this form
  validate,
})(withTranslation('common')(MetamaskForm));
