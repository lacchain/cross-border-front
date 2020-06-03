import React, { PureComponent } from 'react';
import DataPaginationTable from '../../../shared/components/table/DataPaginationTable';
import Pagination from '../../../shared/components/pagination/Pagination';
import restService from '../../../services/restService';
import rowsBuilder from '../../../services/rowsBuilder';
import columns from './columns';
import { web3Service } from '../../../services/web3Service';
import { asyncForEach } from '../../../services/asyncForEach';
import inputHelper from '../../../services/inputHelper';

const initialPage = 1;
const itemsToShow = 10;

class AccountsTable extends PureComponent {
  constructor() {
    super();
    const heads = [...columns];
    this.state = {
      originalRows: [],
      rowsToShow: [],
      loading: true,
      heads: heads
    };
  }

  componentDidMount = async () => {
    let accounts = [];
    try {
      const response = await restService.get('/api/account');
      if (response !== 403) {
        accounts = response.data;
      }
    } catch (e) {
      accounts = [];
    }

    this.setState({ accounts });

    this.buildRows(accounts);
  }

  buildRows = (accounts) => {
    const rows = rowsBuilder.build(accounts);

    const rowsToShow = this.filterRows(rows, initialPage, itemsToShow);
    this.setState({
      rowsToShow,
      originalRows: rows,
      pageOfItems: initialPage,
      loading: false,
    }, () => this.getRowsBalance(rowsToShow));
  };

  onChangePage = (pageOfItems) => {
    if (!pageOfItems) {
      return;
    }

    const { originalRows } = this.state;

    const rowsToShow = this.filterRows(originalRows, pageOfItems, itemsToShow);
    this.setState({ rowsToShow, pageOfItems }, () => this.getRowsBalance(rowsToShow));
  };

  filterRows = (originalRows, pageNumber, rowsOnPage) => {
    const rowsFrom = rowsOnPage * (pageNumber - 1);
    const rowsTo = rowsFrom + rowsOnPage;

    return originalRows.slice(rowsFrom, rowsTo);
  };

  handleGridSort = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const { originalRows } = this.state;
    const rowsToShow = sortDirection === 'NONE' ? originalRows.slice(0, 10) : originalRows.sort(comparer).slice(0, 10);
    this.setState({ rowsToShow }, () => this.getRowsBalance(rowsToShow));
  };

  getRowsBalance = async (rowsToShow) => {
    await asyncForEach(rowsToShow, async row => {
      try {
        let accountBalance = await web3Service.emoneyBalanceOf(row.dltAddress, row.currency);
        row.balance = inputHelper.formatNumber(accountBalance);
      } catch (e) {
        row.balance = 'error getting account balance';
      }
    this.setState({ rowsToShow, heads: this.state.heads.slice() });
    });
  };

  render() {
    const { originalRows, pageOfItems, rowsToShow, loading } = this.state;

    if (loading) {
      return (<div>Loading...</div>);
    }

    if (!rowsToShow.length) {
      return (<div>Not accounts created yet...</div>);
    }

    return (
      <div>
        <DataPaginationTable
          heads={ this.state.heads }
          rows={ rowsToShow }
          handleGridSort={ this.handleGridSort }
          { ...this.props }
          selectable={ true }
          resource="accounts"
          itemResource="dltAddress"
        />
        <Pagination
          itemsCount={ originalRows.length }
          itemsToShow={ itemsToShow }
          pageOfItems={ pageOfItems }
          onChangePage={ this.onChangePage }
        />
      </div>

    );
  }
}
export default AccountsTable;
