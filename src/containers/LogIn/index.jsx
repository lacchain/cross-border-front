import React from 'react';
import LogInForm from './components/LogInForm';
import MetamaskForm from './components/MetamaskForm';
import { web3Service } from '../../services/web3Service';
const citi = `${process.env.PUBLIC_URL}/img/citi.png`;
const lacchain = `${process.env.PUBLIC_URL}/img/lacchain.png`;
const idb = `${process.env.PUBLIC_URL}/img/idb.png`;
const idblab = `${process.env.PUBLIC_URL}/img/idblab.png`;

var idbStyle = {
  width: '90px',
  height: '36px',
};
var lacchainStyle = {
  width: '161px',
  height: '26px',
  marginLeft: '10px',
};
var idblabStyle = {
  width: '171px',
  height: '55px',
};
var citiStyle = {
  width: '30px',
  height: '22px',
  marginLeft:'10px'
};
function isMetamaskLogged() {
  if (!web3Service.isMetamaskLogged()) {
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
const LogIn = (props) => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__card">
      <div className="account__head">
        <img alt="" style={idbStyle} src={idb}></img>
        <img alt="" style={lacchainStyle} src={lacchain}></img>
        <img alt="" style={idblabStyle} src={idblab}></img>
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
        {isMetamaskLogged() ? <LogInForm {...props} /> :
          <MetamaskForm {...props} />}
      </div>
    </div>
  </div>
);

export default LogIn;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
