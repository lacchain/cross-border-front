import React from 'react';
import inputHelper from '../../../services/inputHelper';
import {
  Button,
} from 'reactstrap';

export default [
  {
    key: 'company',
    name: 'Company',
    sortable: true,
    width: 150,
  },
  {
    key: 'fullname',
    name: 'Name',
    sortable: true,
  },
  {
    key: 'bankName',
    name: 'Bank',
    sortable: true,
  },
  {
    key: 'bankAccount',
    name: 'Account number',
    sortable: true,
    formatter: (props) => props.value !== '' ? props.value : 'loading...'
  },
  {
    key: 'dltAddress',
    name: 'DLT address',
    sortable: true,
  },
  {
    key: 'currency',
    name: 'Currency',
    sortable: true,
  },
  {
    key: 'balance',
    name: 'Current Balance',
    sortable: true,
    formatter: (props) => inputHelper.formatNumber(props.value, props.row.currency)
  },
  {
    key: 'status',
    name: 'Status',
    sortable: true,
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
    formatter: (props)=> {
      return (
        <Button  style={ { marginBottom: 0, padding: '3px', width: '100%' } } color="primary" size="sm">See details</Button>
      );
    }
  },
];
