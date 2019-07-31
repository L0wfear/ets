import * as React from 'react';
import Thead from 'components/old/ui/tableNew/table/thead/Thead';
import Tbody from 'components/old/ui/tableNew/table/tbody/Tbody';
import Paginator from 'components/old/ui/new/paginator/Paginator';
import { setStickyThead } from 'utils/stickyTableHeader';

import { makeData, makeDataByPagination } from 'components/old/ui/tableNew/utils';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
    state.pagination.maxPage = Math.ceil(
      state.pagination.totalCount / state.pagination.perPageCount,
    );

    state.showData = makeDataByPagination(
      state.data,
      state.pagination,
      props.uniqName,
    );
    this.state = state;
  }

  componentDidMount() {
    setStickyThead('.custom-table-container', true);
  }

  static getDerivedStateFromProps(
    nextProps: DataTableProps,
    prevState: DataTableState,
  ) {
    if (
      nextProps.data !== prevState.originalData ||
      nextProps.filterValues !== prevState.filterValues
    ) {
      const changesState: any = {};
      changesState.data = makeData({
        data: nextProps.data,
        sortField: prevState.sortField,
        sortAscending: prevState.sortAscending,
        uniqName: nextProps.uniqName,
        filterValues: nextProps.filterValues,
        activeFilter: nextProps.activeFilter,
        tableMeta: nextProps.tableMeta,
      });
      changesState.originalData = nextProps.data;
      changesState.filterValues = nextProps.filterValues;
      changesState.activeFilter = nextProps.activeFilter;
      changesState.pagination = {
        ...prevState.pagination,
        totalCount: changesState.data.length,
      };
      changesState.pagination.maxPage = Math.ceil(
        changesState.pagination.totalCount /
          changesState.pagination.perPageCount,
      );

      if (
        changesState.pagination.maxPage - 1 <
        changesState.pagination.offset
      ) {
        changesState.pagination.offset =
          changesState.pagination.maxPage === 0
            ? 0
            : changesState.pagination.maxPage - 1;
      }
      changesState.showData = makeDataByPagination(
        changesState.data || prevState.data,
        changesState.pagination,
        nextProps.uniqName,
      );

      return changesState;
    }

    return null;
  }

  handleClickTh = (sortField) => {
    const changesState: any = {
      sortField,
      sortAscending:
        this.state.sortField === sortField ? !this.state.sortAscending : false,
      data: this.state.data,
    };

    changesState.data = makeData({
      ...changesState,
      uniqName: this.props.uniqName,
      filterValues: this.state.filterValues,
      activeFilter: this.state.activeFilter,
      tableMeta: this.props.tableMeta,
    });
    changesState.showData = makeDataByPagination(
      changesState.data,
      this.state.pagination,
      this.props.uniqName,
    );

    this.setState(changesState);
  };

  handleRowSelect = (rowData) => {
    try {
      this.props.onRowClick({ props: { data: rowData } });
    } catch (e) {
      // function handleRowSelect not defined in father
    }
  };
  handleRowDoubleClick = (rowData) => {
    try {
      this.props.onRowDoubleClick({ props: { data: rowData } });
    } catch (e) {
      // function onRowDoubleClick not defined in father
    }
  };
  toggleChildren = (rowData) => {
    const { uniqName } = this.props;

    this.setState({
      showData: makeData({
        data: this.state.showData.map((row) => ({
          ...row,
          showChildren:
            rowData[uniqName] === row[uniqName]
              ? !row.showChildren
              : row.showChildren,
        })),
        sortField: this.state.sortField,
        sortAscending: this.state.sortAscending,
        uniqName: this.props.uniqName,
        filterValues: this.props.filterValues,
        activeFilter: this.state.activeFilter,
        tableMeta: this.props.tableMeta,
      }),
    });
  };

  setPaginationOffset = (offset) => {
    const changesState: any = {};
    changesState.pagination = { ...this.state.pagination, offset };
    changesState.showData = makeDataByPagination(
      this.state.data,
      changesState.pagination,
      this.props.uniqName,
    );

    this.setState({ ...changesState });
  };

  render() {
    const { pagination } = this.state;

    return (
      <>
        <div className="custom-table-container">
          <EtsBootstrap.Table striped condensed className={'custom-data-table'}>
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
          </EtsBootstrap.Table>
        </div>
        <PaginatorTsx
          firstLastButtons
          currentPage={pagination.offset}
          maxPage={pagination.maxPage}
          setPage={this.setPaginationOffset}
        />
      </>
    );
  }
}

export default DataTable;
