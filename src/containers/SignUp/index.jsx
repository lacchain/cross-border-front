import React from 'react';
import SignUpForm from './components/SignUpForm';
import MetamaskForm from '../LogIn/components/MetamaskForm';
import { web3Service } from '../../services/web3Service';
const citi = `${process.env.PUBLIC_URL}/img/citi.png`;
const lacchain = `${process.env.PUBLIC_URL}/img/lacchain.png`;
const idb = `${process.env.PUBLIC_URL}/img/idb.png`;
const techlab = `${process.env.PUBLIC_URL}/img/techlab.png`;

var idbStyle = {
  width: '110px',
  height: '44px',
};
var lacchainStyle = {
  width: '161px',
  height: '26px',
  marginLeft: '10px',
  marginRight: '10px'
};
var techlabStyle = {
  width: '88px',
  height: '24px',
};
var citiStyle = {
  width: '30px',
  height: '22px',
  marginLeft:'10px'
};
function isMetamaskLogged() {
  if (!web3Service.isMetamaskInstalled()) {
    return false;
  } else {
    window.ethereum.on("networkChanged", () => {
      window.location.reload()
    });
    window.ethereum.on("accountsChanged", () => {
      window.location.reload()
    });
    // If a web3 instance is already provided by Meta Mask.
    if (window.ethereum.networkVersion === process.env.DLT_NETWORKS) {
      localStorage.setItem('userDltAddress', window.web3.eth.defaultAccount);
      return true;
    } else {
      return false;
    }
  }
}
const SignUp = (props) => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__card">
      <div className="account__head">
        <img alt="" style={idbStyle} src={idb}></img>
        <img alt="" style={lacchainStyle} src={lacchain}></img>
        <img alt="" style={techlabStyle} src={techlab}></img>
        </div>
        <div className="account__head">
          <h4 className="account__subhead subhead text-center">In colaboration with <img alt="" style={citiStyle} src={citi}></img></h4>
        </div>
        <div className="account__head">
          <h3 className="account__title">Welcome to
            <span className="account__logo"> LaCChain
              <span className="account__logo-accent">CrossBorder</span>
            </span>
          </h3>
          <h4 className="account__subhead subhead text-center">Cross border payments using blockchain</h4>
        </div>
        {isMetamaskLogged() ? <SignUpForm {...props} /> :
          <MetamaskForm {...props} />}
      </div>
    </div>
  </div>
);

export default SignUp;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
