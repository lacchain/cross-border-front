import React, { PureComponent } from 'react';
import ReactDataGrid from 'react-data-grid';
import PropTypes from 'prop-types';

export default class DataPaginationTable extends PureComponent {
  static propTypes = {
    heads: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
      editable: PropTypes.bool,
      sortable: PropTypes.bool,
      selectable: PropTypes.bool,
      resource: PropTypes.string,
      itemResource: PropTypes.string
    })).isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  rowGetter = (rowIdx) => {
    const { rows } = this.props;
    let row = Object.assign({}, rows[rowIdx]);

    row.get = key => {
      let splitedkey = key.split('.');

      if (key.includes('.')) {
        return row[splitedkey[0]] ? row[splitedkey[0]][splitedkey[1]] : '';
      }  else {
        return row[key];
      }
    };

    return row;
  };

  rowRenderer = ({ renderBaseRow, ...props }) => {
    const opacity = 1;

    return <div style={ { opacity } }>{renderBaseRow(props)}</div>;
  };

  render() {
    const { heads, rows, handleGridSort, sortColumn, sortDirection, history, selectable, resource, itemResource } = this.props;

    return (
      <div className="table" id="parentDivOfGrid">
        <ReactDataGrid
          onRowClick={ (row, elem) => {
            if (row === -1 || !selectable) {
              return;
            }
          
            history.push(`/pages/${resource}/${elem[itemResource]}/details`);
          } }
          onGridSort={ handleGridSort }
          columns={ heads }
          rowGetter={ this.rowGetter }
          rowsCount={ rows.length }
          rowHeight={ 44 }
          minColumnWidth={ 100 }
          sortColumn={ sortColumn }
          rowRenderer={ this.rowRenderer }
          sortDirection={ sortDirection }
        />
      </div>
    );
  }
}
