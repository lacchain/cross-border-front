import React, { PureComponent } from 'react';
import DataPaginationTable from '../../../shared/components/table/DataPaginationTable';
import Pagination from '../../../shared/components/pagination/Pagination';
import restService from '../../../services/restService';
import rowsBuilder from '../../../services/rowsBuilder';
import columns from './columns';

const initialPage = 1;
const itemsToShow = 10;
const initialSort = (a, b) => {
  return (a['datetime'] < b['datetime']) ? 1 : -1;
};
class MovementsTable extends PureComponent {
  constructor() {
    super();
    const heads = [...columns];
    this.state = {
      originalRows: [],
      rowsToShow: [],
      loading: true,
      heads: heads,
      timer: null
    };
  }
  componentDidMount() {
    this.getMovements()
    let timer = setInterval(()=> this.getMovements(), process.env.POLLING_TIMER);
    this.setState({ timer })
  }
  
  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({ timer: null});
  }

  getMovements = async () => {
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

    let rowsToShow = this.filterRows(rows, initialPage, itemsToShow);
    rowsToShow = rowsToShow.sort(initialSort).slice(0, 10);
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

    let rowsToShow = this.filterRows(originalRows, pageOfItems, itemsToShow);
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
    const rowsToShow = sortDirection === 'NONE' ? originalRows.sort(initialSort).slice(0, 10) : originalRows.sort(comparer).slice(0, 10);
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
