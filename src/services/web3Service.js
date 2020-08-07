import Web3 from 'web3';
import store from '../containers/App/storeConfig';
import notificationActions from '../features/notification/duck/actions';
import { v4 as uuidv4 } from 'uuid';

const EmoneyTokenDollar = require('../contracts/EmoneyTokenDollar.json');
const EmoneyTokenPeso = require('../contracts/EmoneyTokenPeso.json');
const CrossBorderPayment = require('../contracts/CrossBoarderPayment.json');
const abiEmoneyTokenDollar = EmoneyTokenDollar.abi;
const abiEmoneyTokenPeso = EmoneyTokenPeso.abi;
const abiCrossBorderPayment = CrossBorderPayment.abi;
const eDollarAddress = process.env.EDOLLAR_ADDRESS;
const ePesosAddress = process.env.EPESO_ADDRESS;
const crossborderAddress = process.env.CROSSBORDER_ADDRESS;
let web3;

const options = {
    defaultBlock: 'latest',
    transactionConfirmationBlocks: 1,
};

export const web3Service = {
    setUpWeb3Service,
    asciiToHex,
    bytesToHex,
    bytesToString,
    emoneyBalanceOf,
    isMetamaskInstalled,
    whitelistAccount,
    mintMoney,
    isMetamaskLogged,
    orderTransfer,
    approveTransfer,
    cancelAccount
};

function isMetamaskInstalled() {
    return window.web3
}

function isMetamaskLogged() {
    if(window.web3) {
        return window.web3.eth.defaultAccount;
    }
}

function setUpWeb3Service() {
    if (process.env.METAMASK === 'false') {
        web3 = new Web3(process.env.DLT_NODE, undefined, options);

        return web3;
    }

    if (!window.web3) {
        return
    }

    // Use Mist/MetaMask's provider
    web3 = new Web3(window.web3.currentProvider);

    window.web3.version.getNetwork((err, netId) => {
        if (process.env.DLT_NETWORKS === netId) {
            return true;
        } else {
            return false;
        }
    });
}

function getContract(abi, address) {
    web3 = new Web3(window.web3.currentProvider);
    return new web3.eth.Contract(abi, address);
}

async function whitelistAccount(accountAddress, currency) {
    web3 = new Web3(window.web3.currentProvider);
    let emoneyContract
    if (currency === 'USD') {
        emoneyContract = getContract(abiEmoneyTokenDollar, eDollarAddress);
    } else {
        emoneyContract = getContract(abiEmoneyTokenPeso, ePesosAddress);
    }
    try {
        emoneyContract.methods
            .addWhitelisted(accountAddress.toLowerCase()) //function in contract
            .send({
                from: window.web3.currentProvider.selectedAddress,
                to: eDollarAddress,
                gasPrice: '0'
            }).once('confirmation', function () {
                store.dispatch(notificationActions.setSuccessNotification(
                    'Account whitelisted!',
                    'Congratulations, the account has been successfully whitelisted!'
                  ));
                return
            })
            .once('error', function (e) {
                console.log(e);
                store.dispatch(notificationActions.setErrorNotification(
                  'Can\'t whitelist the account',
                  'An error ocurred while whitelisting the account in the DLT, please try again'
                ));
              })
    } catch (e) {
        console.log(e);
    }
}

async function cancelAccount(accountAddress, currency) {
    web3 = new Web3(window.web3.currentProvider);
    let emoneyContract
    if (currency === 'USD') {
        emoneyContract = getContract(abiEmoneyTokenDollar, eDollarAddress);
    } else {
        emoneyContract = getContract(abiEmoneyTokenPeso, ePesosAddress);
    }
    try {
        emoneyContract.methods
            .removeWhitelisted(accountAddress.toLowerCase()) //function in contract
            .send({
                from: window.web3.currentProvider.selectedAddress,
                to: eDollarAddress,
                gasPrice: '0'
            }).once('confirmation', function () {
                store.dispatch(notificationActions.setSuccessNotification(
                    'Account cancelled!',
                    'Congratulations, the account has been successfully cancelled!'
                  ));
                return
            })
            .once('error', function (e) {
                console.log(e);
                store.dispatch(notificationActions.setErrorNotification(
                  'Can\'t cancel the account',
                  'An error ocurred while cancelling the account in the DLT, please try again'
                ));
              })
    } catch (e) {
        console.log(e);
    }
}

async function mintMoney(accountAddress, amount, currency) {
    let emoneyContract
    let address
    if (currency === 'USD') {
        emoneyContract = getContract(abiEmoneyTokenDollar, eDollarAddress);
        address = eDollarAddress
    } else {
        emoneyContract = getContract(abiEmoneyTokenPeso, ePesosAddress);
        address = ePesosAddress
    }
    web3 = new Web3(window.web3.currentProvider);
    try {
        emoneyContract.methods
            .mint(accountAddress.toLowerCase(), amount) //function in contract
            .send({
                from: window.web3.currentProvider.selectedAddress,
                to: address,
                gasPrice: 0
            }).once('confirmation', function () {
                store.dispatch(notificationActions.setSuccessNotification(
                    'Money tokenized!',
                    'Congratulations, the money has been successfully tokenized!'
                  ));
                  return
            })
            .once('error', function (e) {
                console.log(e);
                store.dispatch(notificationActions.setErrorNotification(
                  'Can\'t tokenize the money',
                  'An error ocurred while tokenizing the money in the DLT, please try again'
                ));
              })
    } catch (e) {
        console.log(e);
    }
}

async function orderTransfer(to, operator, amount, rate) {
    const crossBorderContract = getContract(abiCrossBorderPayment, crossborderAddress);
    web3 = new Web3(window.web3.currentProvider);
    try {
        crossBorderContract.methods
            .orderTransfer(uuidv4(), to, operator.toLowerCase(), amount, rate) //function in contract
            .send({
                from: window.web3.currentProvider.selectedAddress,
                to: crossborderAddress,
                gasPrice: 0
            }).once('confirmation', function () {
                store.dispatch(notificationActions.setSuccessNotification(
                    'Cross border transfer ordered!',
                    'Congratulations, the transfer has been successfully ordered!'
                  ));
                  return
            })
            .once('error', function (e) {
                console.log(e);
                store.dispatch(notificationActions.setErrorNotification(
                  'Can\'t order the transfer',
                  'An error ocurred while ordering the transfer in the DLT, please try again'
                ));
              })
    } catch (e) {
        console.log(e);
    }
}

async function approveTransfer(operationId) {
    const crossBorderContract = getContract(abiCrossBorderPayment, crossborderAddress);
    
    web3 = new Web3(window.web3.currentProvider);
    try {
        crossBorderContract.methods
            .approveTransfer(operationId) //function in contract
            .send({
                from: window.web3.currentProvider.selectedAddress,
                to: crossborderAddress,
                gasPrice: 0
            }).once('confirmation', function () {
                store.dispatch(notificationActions.setSuccessNotification(
                    'Cross border transfer approved!',
                    'Congratulations, the transfer has been successfully approved!'
                  ));
                  return
            })
            .once('error', function (e) {
                console.log(e);
                store.dispatch(notificationActions.setErrorNotification(
                  'Can\'t approve the transfer',
                  'An error ocurred while approving the transfer in the DLT, please try again'
                ));
              })
    } catch (e) {
        console.log(e);
    }
}

async function emoneyBalanceOf(who, currency) {
    let emoneyContract
    if (currency === 'USD') {
        emoneyContract = getContract(abiEmoneyTokenDollar, eDollarAddress);
    } else {
        emoneyContract = getContract(abiEmoneyTokenPeso, ePesosAddress);
    }
    
    const balance = await emoneyContract.methods.balanceOf(who.toLowerCase()).call();

    return parseFloat(balance.toString()) / Math.pow(10, 4);
}

function asciiToHex(string) {
    return web3.utils.asciiToHex(string);
}

function bytesToHex(string) {
    return web3.utils.bytesToHex(string);
}

function bytesToString(string) {
    return web3.utils.hexToUtf8(string);
}