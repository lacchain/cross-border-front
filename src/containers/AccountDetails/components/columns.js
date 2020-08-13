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
    formatter: (props) => {
      return (
        <div style={{textAlign: 'right'}}>{inputHelper.formatNumber(props.value, props.row.senderCurrency)}</div>
      )
    }
  },
  {
    key: 'amount_received',
    name: 'Amount received',
    sortable: true,
    formatter: (props) => {
      return (
        <div style={{textAlign: 'right'}}>{inputHelper.formatNumber(props.value, props.row.receiverCurrency)}</div>
      )
    }
  },
  {
    key: 'rate_applied',
    name: 'Rate applied',
    sortable: true,
    width: 90,
    formatter: (props) => {
      return (
        <div>{inputHelper.formatNumber4Decimals(props.value)}</div>
      )
    }
  },
  {
    key: 'fee_applied',
    name: 'Fee applied',
    sortable: true,
    width: 90,
  },
  {
    key: 'status',
    name: 'Status',
    width: 120,
    sortable: true,
    formatter: (props)=> {
      let status = props.value.toLowerCase().replace(/\s/g,'');
      if (status == 'inprogress') {
        status = 'approved';
      }
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