import React from 'react';
import moment from 'moment';
import inputHelper from '../../../services/inputHelper';
import {
  Button,
} from 'reactstrap';

export default [
  {
    key: 'datetime',
    name: 'Date',
    sortable: true,
    width: 110,
    formatter: (props)=> moment(props.value).format('MM/DD/YYYY'),
  },
  {
    key: 'transfer_type',
    name: 'Type',
    sortable: true,
  },
  {
    key: 'sender_name',
    name: 'From',
    sortable: true,
  },
  {
    key: 'receiver_name',
    name: 'To',
    sortable: true,
  },
  {
    key: 'amount',
    name: 'Amount sent',
    sortable: true,
    formatter: (props) => '- ' +  inputHelper.formatNumber(props.value, props.row.currency)
  },
  {
    key: 'amount_received',
    name: 'Amount received',
    sortable: true,
    formatter: (props) => '+ ' + inputHelper.formatNumber(props.value, props.row.currency)
  },
  {
    key: 'rate_applied',
    name: 'Rate applied',
    sortable: true,
  },
  {
    key: 'fee_applied',
    name: 'Fee applied',
    sortable: true,
  },
  {
    key: 'status',
    name: 'Status',
    width: 120,
    sortable: true,
    formatter: (props)=> {
      let status = props.value.toLowerCase().replace(/\s/g,'');
      return (
        <div>
          <div className={ `badge badge-${status}` }>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
        </div>
      );
    },
  },
  {
    key: 'actions',
    name: 'Actions',
    sortable: true,
    formatter: (props)=> {
      return (
        <Button  style={ { marginBottom: 0, padding: '3px', width: '100%' } } color="primary" size="sm">See details</Button>
      );
    }
  },
];