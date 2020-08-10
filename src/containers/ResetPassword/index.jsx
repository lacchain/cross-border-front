import React from 'react';
import ResetPasswordForm from './components/ResetPasswordForm';
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
  width: '55px',
  height: '40px',
  marginLeft:'10px',
  marginTop: '-10px'
};
const ResetPassword = (props) => (
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
            <span className="account__logo"> LACChain
              <span className="account__logo-accent">CrossBorder</span>
            </span>
          </h3>
          <h4 className="account__subhead subhead text-center">Cross border payments using blockchain</h4>
          <hr></hr>
          <h3>Set new password</h3>
        </div>
          <ResetPasswordForm {...props} /> 
      </div>
    </div>
  </div>
);

export default ResetPassword;