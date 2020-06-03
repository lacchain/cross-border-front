import React from 'react';
import inputHelper from '../../../services/inputHelper';
import {
  Button,
} from 'reactstrap';
import moment from 'moment';

export default [
  {
    key: 'datetime',
    name: 'Time',
    sortable: true,
    width: 90,
    formatter: (props)=> moment(props.value).format('DD/MM/YYYY'),
  },
  {
    key: 'senderBank',
    name: 'Sender',
    width: 90,
    sortable: true,
  },
  {
    key: 'senderDltAddress',
    name: 'Sender DLT address',
    width: 140,
    sortable: true,
  },
  {
    key: 'receiverBank',
    name: 'Recipient',
    sortable: true,
    width: 90,
    formatter: (props) => props.value !== '' ? props.value : 'loading...'
  },
  {
    key: 'receiverDltAddress',
    name: 'Recipient DLT address',
    width: 150,
    sortable: true,
  },
  {
    key: 'amountSent',
    name: 'Sent amount',
    sortable: true,
    width: 90,
  },
  {
    key: 'amountReceived',
    name: 'Received amount',
    sortable: true,
    width: 120,
    formatter: (props) => inputHelper.formatNumber(props.value, props.row.currency)
  },
  {
    key: 'fee',
    name: 'Fee',
    sortable: true,
    width: 50,
    formatter: (props) => inputHelper.formatNumber(props.value, props.row.currency)
  },
  {
    key: 'rateApplied',
    name: 'Rate applied',
    sortable: true,
    width: 90,
    formatter: (props) => inputHelper.formatNumber(props.value, props.row.currency)
  },
  {
    key: 'status',
    name: 'Status',
    sortable: true,
    width: 120,
    formatter: (props)=> {
      let status = props.value.toLowerCase().replace(/\s/g,'');
      return (
        <div>
          <div className={ `badge badge-${status}` }>{status}</div>
        </div>
      );
    },
  },
  {
    key: 'actions',
    name: 'Actions',
    sortable: true,
    width: 110,
    formatter: (props)=> {
      return (
        <Button  style={ { marginBottom: 0, padding: '3px', width: '100%' } } color="primary" size="sm">See details</Button>
      );
    }
  },
];
