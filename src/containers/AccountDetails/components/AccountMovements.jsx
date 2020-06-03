import React, { PureComponent } from 'react';
import DataPaginationTable from '../../../shared/components/table/DataPaginationTable';
import Pagination from '../../../shared/components/pagination/Pagination';
import columns from './columns';
import Panel from '../../../shared/components/Panel';
import rowsBuilder from '../../../services/rowsBuilder';
import { asyncForEach } from '../../../services/asyncForEach';

const initialPage = 1;
const itemsToShow = 10;

class AccountMovements extends PureComponent {
  constructor() {
    super();
    const heads = [...columns];

    this.state = {
      originalRows: [],
      rowsToShow: [],
      loading: false,
      heads: heads,
      movements: null,
      accountSale: null,
      loadingAddresses: [],
    };
  }

  componentDidMount = async () => {
    let movements = this.props.movements
    this.setState({ movements });
    if (movements.length > 0) {
      this.buildRows(movements);
    }
  };

  buildRows = async (movements) => {
    const rows = rowsBuilder.build(movements);
    rows.currency = this.props.account.accountDetails.currency
    let rowsToShow = this.filterRows(rows, initialPage, itemsToShow);
    await asyncForEach(rowsToShow, async row => {
      row.currency = this.props.account.accountDetails.currency
    });
    this.setState({
      rowsToShow,
      originalRows: rows,
      pageOfItems: initialPage,
      loading: false,
    });
  };

  onChangePage = (pageOfItems) => {
    if (!pageOfItems) {
      return;
    }

    const { originalRows } = this.state;

    const rowsToShow = this.filterRows(originalRows, pageOfItems, itemsToShow);
    this.setState({ rowsToShow, pageOfItems });
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

    this.setState({ rowsToShow });
  };

  render() {
    const { originalRows, pageOfItems, rowsToShow, loading } = this.state;
    if (loading) {
      return (<div>Loading...</div>);
    }

    if (!rowsToShow.length) {
      return (
        <Panel
          lg={12}
          xl={12}
          xs={12}
          title="Account movements"
          panelClass={'lateral-panel'}
        >
          <div>
            <h4 class="bold-text-aling-center">No movements</h4>
          </div>
        </Panel>);
    }
    return (
      <Panel
        lg={12}
        xl={12}
        xs={12}
        title="Account movements"
        panelClass={'lateral-panel'}
      >
        <div>
          <DataPaginationTable
            heads={this.state.heads}
            rows={rowsToShow}
            handleGridSort={this.handleGridSort}
            {...this.props}
            selectable={true}
            resource="movements"
            itemResource="id"
          />
          <Pagination
            itemsCount={originalRows.length}
            itemsToShow={itemsToShow}
            pageOfItems={pageOfItems}
            onChangePage={this.onChangePage}
          />
        </div>
      </Panel>
    );
  }
}

export default AccountMovements