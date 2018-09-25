import * as React from 'react';
import { Table } from 'react-bootstrap';
import Thead from 'components/ui/tableNew/table/thead/Thead';
import Tbody from 'components/ui/tableNew/table/tbody/Tbody';
import Paginator from 'components/ui/Paginator';

import {
  makeData,
  makeDataByPagination,
} from 'components/ui/tableNew/utils';

const PaginatorTsx: any = Paginator;

interface DataTableProps {
  [key: string]: any;
}

interface DataTableState {
  [key: string]: any;
}

class DataTable extends React.Component<DataTableProps, DataTableState> {
  constructor(props) {
    super(props);

    const state = {
      sortField: props.initialSort || '',
      sortAscending: props.initialSortAscending || false,
      originalData: props.data,
      data: props.data,
      filterValues: props.filterValues,
      activeFilter: props.activeFilter,
      showData: [],
      pagination: {
        offset: 0,
        totalCount: 0,
        perPageCount: 15,
        maxPage: 0,
      },
    };

    state.data = makeData({
      data: props.data,
      sortField: state.sortField,
      sortAscending: state.sortAscending,
      uniqName: props.uniqName,
      filterValues: props.filterValues,
      activeFilter: props.activeFilter,
      tableMeta: props.tableMeta,
    });

    state.pagination.totalCount = state.data.length;
    state.pagination.maxPage = Math.ceil(state.pagination.totalCount / state.pagination.perPageCount);

    state.showData = makeDataByPagination(state.data, state.pagination, props.uniqName);
    this.state = state;
  }

  componentWillReceiveProps(nextProps) {
    const changesState: any = {};

    if (nextProps.data !== this.state.originalData || nextProps.filterValues !== this.state.filterValues) {
      changesState.data = makeData({
        data: nextProps.data,
        sortField: this.state.sortField,
        sortAscending: this.state.sortAscending,
        uniqName: this.props.uniqName,
        filterValues: nextProps.filterValues,
        activeFilter: nextProps.activeFilter,
        tableMeta: this.props.tableMeta,
      });
      changesState.originalData = nextProps.data;
      changesState.filterValues = nextProps.filterValues;
      changesState.activeFilter = nextProps.activeFilter;
      changesState.pagination = { ...this.state.pagination, totalCount: changesState.data.length };
      changesState.pagination.maxPage = Math.ceil(changesState.pagination.totalCount / changesState.pagination.perPageCount);

      if (changesState.pagination.maxPage - 1 < changesState.pagination.offset) {
        changesState.pagination.offset = changesState.pagination.maxPage === 0 ? 0 : changesState.pagination.maxPage - 1;
      }
      changesState.showData = makeDataByPagination(changesState.data || this.state.data, changesState.pagination, nextProps.uniqName);
    }

    this.setState(changesState);
  }

  handleClickTh = sortField => {
    const changesState: any = {
      sortField,
      sortAscending: this.state.sortField === sortField ? !this.state.sortAscending : false,
      data: this.state.data,
    };

    changesState.data = makeData({
      ...changesState,
      uniqName: this.props.uniqName,
      filterValues: this.state.filterValues,
      activeFilter: this.state.activeFilter,
      tableMeta: this.props.tableMeta,
    });
    changesState.showData = makeDataByPagination(changesState.data, this.state.pagination, this.props.uniqName);

    this.setState(changesState);
  }

  handleRowSelect = rowData => {
    try {
      this.props.onRowClick({ props: { data: rowData }});
    } catch (e) {
      // function handleRowSelect not defined in father
    }
  }
  handleRowDoubleClick = rowData => {
    try {
      this.props.onRowDoubleClick({ props: { data: rowData }});
    } catch (e) {
      // function onRowDoubleClick not defined in father
    }
  }
  toggleChildren = rowData => {
    const { uniqName } = this.props;

    this.setState({
      showData: makeData({
        data: this.state.showData.map(row => ({
          ...row,
          showChildren: rowData[uniqName] === row[uniqName] ? !row.showChildren : row.showChildren,
        })),
        sortField: this.state.sortField,
        sortAscending: this.state.sortAscending,
        uniqName: this.props.uniqName,
        filterValues: this.props.filterValues,
        activeFilter: this.state.activeFilter,
        tableMeta: this.props.tableMeta,
      }),
    });
  }

  setPaginationOffset = offset => {
    const changesState: any = {};
    changesState.pagination = { ...this.state.pagination, offset };
    changesState.showData = makeDataByPagination(this.state.data, changesState.pagination, this.props.uniqName);
    
    this.setState({ ...changesState })
  }

  render() {
    const { pagination } = this.state;

    return (
      <div className="custom-table-container">
        <Table striped condensed className={'custom-data-table'}>
          <Thead
            tableMeta={[this.props.tableMeta]}
            handleClick={this.handleClickTh}
            sortField={this.state.sortField}
            sortAscending={this.state.sortAscending}
          />
          <Tbody
            tableMeta={this.props.tableMeta}
            data={this.state.showData}
            uniqName={this.props.uniqName}
            handleClick={this.handleRowSelect}
            handleDoubleClick={this.handleRowDoubleClick}
            toggleChildren={this.toggleChildren}
            selected={this.props.selected}
            offset={pagination.offset * pagination.perPageCount}
            hasData={this.props.hasData}
          />
        </Table>
        <PaginatorTsx
          firstLastButtons
          currentPage={pagination.offset}
          maxPage={pagination.maxPage}
          setPage={this.setPaginationOffset}
        />
      </div>
    );
  }
}

export default DataTable;
