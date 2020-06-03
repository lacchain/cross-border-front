import React from 'react';
import moment from 'moment';
import inputHelper from '../../../services/inputHelper';
import {
  Button,
} from 'reactstrap';
import ArrowTopRightIcon from 'mdi-react/ArrowTopRightIcon';
import ArrowBottomRightIcon from 'mdi-react/ArrowBottomRightIcon';

export default [
  {
    key: 'datetime',
    name: 'Time',
    sortable: true,
    width: 110,
    formatter: (props)=> moment(props.value).format('DD/MM/YYYY'),
  },
  {
    key: 'transfer_type',
    name: 'Type',
    sortable: true,
    formatter: (props)=> {
      if (props.value == 'TRANSFER OUT') {
        return (
          <div>
            <ArrowTopRightIcon color={'#0c658b'}/> {props.value}
          </div>
        );
      } else{
      return (
        <div>
        <ArrowBottomRightIcon color={'#1dca98'}/> {props.value}
      </div>
      );
    }
    }
  },
  {
    key: 'company',
    name: 'Form/to',
    sortable: true,
  },
  {
    key: 'dlt_address',
    name: 'DLT Address',
    sortable: true,
  },
  {
    key: 'amount_received',
    name: 'Amount',
    sortable: true,
    formatter: (props) => props.row.transfer_type == 'TRANSFER OUT' ? '- ' +  inputHelper.formatNumber(props.value, props.row.currency) : '+ ' + inputHelper.formatNumber(props.value, props.row.currency)
  },
  {
    key: 'detail',
    name: 'Details',
    sortable: true,
  },
  {
    key: 'status',
    name: 'Status',
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