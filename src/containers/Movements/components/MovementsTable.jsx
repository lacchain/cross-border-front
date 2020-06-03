import React, { PureComponent } from 'react';
import DataPaginationTable from '../../../shared/components/table/DataPaginationTable';
import Pagination from '../../../shared/components/pagination/Pagination';
import restService from '../../../services/restService';
import rowsBuilder from '../../../services/rowsBuilder';
import columns from './columns';

const initialPage = 1;
const itemsToShow = 10;

class MovementsTable extends PureComponent {
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
    let movements = [];
    try {
      const response = await restService.get('/api/account/transactions');
      if (response !== 403) {
        movements = response.data;
      }
    } catch (e) {
      movements = [];
    }

    this.setState({ movements });

    this.buildRows(movements);
  }

  buildRows = (movements) => {
    const rows = rowsBuilder.build(movements);

    const rowsToShow = this.filterRows(rows, initialPage, itemsToShow);
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
      return (<div>Not movements created yet...</div>);
    }

    return (
      <div>
        <DataPaginationTable
          heads={ this.state.heads }
          rows={ rowsToShow }
          handleGridSort={ this.handleGridSort }
          { ...this.props }
          selectable={ true }
          resource="movements"
          itemResource="id"
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
export default MovementsTable;
