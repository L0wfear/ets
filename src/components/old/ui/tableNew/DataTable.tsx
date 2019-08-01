import * as React from 'react';
import Table from 'components/old/ui/tableNew/table/Table';
import FilterButton from 'components/old/ui/tableNew/filter-button/FIlterButton';
import Filter from 'components/old/ui/tableNew/filter/Filter';
import Div from 'components/old/ui/Div';

import { makeTableMeta } from 'components/old/ui/tableNew/utils';

interface DataTableProps {
  [key: string]: any;
}

interface DataTableState {
  [key: string]: any;
}

const emptyFilter = {};

class DataTable extends React.Component<DataTableProps, DataTableState> {
  static get defaultProps() {
    return {
      enumerated: true,
      filterModalIsOpen: false,
      activeFilter: false,
      filterValues: emptyFilter,
    };
  }
  constructor(props) {
    super(props);

    const state = {
      tableMeta: makeTableMeta(props.tableMeta, props),
      tableMeta_original: props.tableMet,
      enumerated: props.enumerated,
      filterValuesOrigina: props.filterValues,
      filterValues: props.filterValues,
      propsData: props.data,
      hasData: !!props.data.length,
    };

    this.state = state;
  }

  static getDerivedStateFromProps(nextProps: DataTableProps, prevState: DataTableState) {
    const {
      enumerated,
      tableMeta: tableMeta_next,
      data: data_next,
      filterValues,
    } = nextProps;
    const { tableMeta_original } = prevState;
    const changesState: any = {};
    let hasChanges = false;

    if (prevState.enumerated !== enumerated || tableMeta_original !== tableMeta_next) {
      changesState.tableMeta = makeTableMeta(tableMeta_next, nextProps);
      changesState.enumerated = enumerated;

      hasChanges = true;
    }

    if (prevState.propsData !== data_next) {
      changesState.propsData = data_next;
      changesState.hasData = !!data_next.length;

      hasChanges = true;
    }

    if (prevState.filterValuesOrigina !== filterValues) {
      changesState.filterValuesOrigina = filterValues;
      changesState.filterValues = filterValues;
      changesState.activeFilter = !!Object.keys(filterValues).length;

      hasChanges = true;
    }

    if (hasChanges) {
      return changesState;
    }

    return null;
  }

  toggleFilter = () => this.setState({ filterModalIsOpen: !this.state.filterModalIsOpen });
  saveFilter = (filterValues) => {
    console.log('SAVE FILTER', filterValues); // tslint:disable-line:no-console

    this.setState({
      filterValues,
      activeFilter: !!Object.keys(filterValues).length,
    });
  }

  render() {
    const {
      activeFilter,
      filterModalIsOpen,
      tableMeta,
      propsData,
    } = this.state;
    const { noFilter } = this.props;

    return (
      <div className="registry-new">
        <div className="header">
          <div>
            <h4>{this.props.title}</h4>
          </div>
          <div className="buttons">
            {!noFilter &&
              <FilterButton
                show={filterModalIsOpen}
                active={activeFilter}
                onClick={this.toggleFilter}
              />
            }
            { this.props.children }
          </div>
        </div>
        <Div hidden={noFilter}>
          <Filter
            show={filterModalIsOpen}
            onSubmit={this.saveFilter}
            toggleFilter={this.toggleFilter}
            filterValues={this.state.filterValues}
            tableMeta={tableMeta}
            haveActiveFilter={activeFilter}
            data={propsData}
          />
        </Div>
        <Table
          data={propsData}
          initialSort={this.props.initialSort}
          initialSortAscending={this.props.initialSortAscending}
          selected={this.props.selected}
          tableMeta={tableMeta}
          uniqName={this.props.uniqName}
          filterValues={this.state.filterValues}
          activeFilter={this.state.activeFilter}
          hasData={this.state.hasData}

          onRowClick={this.props.onRowClick}
          onRowDoubleClick={this.props.onRowDoubleClick}
        />
      </div>
    );
  }
}

export default DataTable;
