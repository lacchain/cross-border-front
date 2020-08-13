import numeral from 'numeral';

const normalize = (value) => value.replace(/[^\d.-]/g, '', '');
const formatNumber = (value, currency) => `${currency ? currency : ''} ${numeral(value).format('0,00.00')} `;
const formatNumber4Decimals = (value, currency = true) => `${currency ? '' : ''}${numeral(value).format('0,00.0000')}`;
const formatNumber6Decimals = (value, currency = true) => `${currency ? '€' : ''}${numeral(value).format('0,00.[000000]')}`;
const formatDate = (value) => new Date(value).toLocaleDateString();

export default {
  normalize,
  formatNumber,
  formatDate,
  formatNumber6Decimals,
  formatNumber4Decimals
};
