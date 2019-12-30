import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';

import { EtsTableWrapNoScroll } from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type Props = {
  id: string;
  [k: string]: any;
};

class Table extends React.Component<Props, any> {
  static get propTypes() {
    return {
      headerRenderers: PropTypes.any,
      pageSize: PropTypes.number,
      columnCaptions: PropTypes.array,
      tableCols: PropTypes.array,
      onRowSelected: PropTypes.func,
      data: PropTypes.array,
      cellRenderers: PropTypes.object,
      usePagination: PropTypes.bool,
    };
  }

  static defaultProps = {
    headerRenderers: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      selectedRow: null,
    };
  }

  onRowClick = (id) => {
    if (this.props.onRowSelected !== undefined) {
      this.setState({
        selectedRow: id,
      });
      this.props.onRowSelected(id);
    }
  };

  getNumPages() {
    let num = Math.floor(this.props.data.length / this.props.pageSize);
    if (this.props.data.length % this.props.pageSize > 0) {
      num += 1;
    }
    return num;
  }

  getPage() {
    const start = this.props.pageSize * (this.state.currentPage - 1);
    const end = start + this.props.pageSize;

    return {
      currentPage: this.state.currentPage,
      data: this.props.data.slice(start, end),
      numPages: this.getNumPages(),
      handleClick: this.setPage,
    };
  }

  setPage = (num) => {
    this.setState({
      currentPage: num,
    });
  };

  renderHeader() {
    return (
      <EtsBootstrap.Grid.GridBootstrapThead.Thead className="ets-table-header">
        <EtsBootstrap.Grid.GridBootstrapThead.Tr>
          {this.props.columnCaptions.map((o, i) => {
            return (
              <EtsBootstrap.Grid.GridBootstrapThead.Th
                key={i}
                width={o.width}
                className={o.className}>
                {o.value}
              </EtsBootstrap.Grid.GridBootstrapThead.Th>
            );
          })}
        </EtsBootstrap.Grid.GridBootstrapThead.Tr>
      </EtsBootstrap.Grid.GridBootstrapThead.Thead>
    );
  }

  render() {
    const page = this.getPage();
    const rows = page.data.map((o, i) => (
      <TrRow
        renderers={this.props.cellRenderers}
        key={i}
        cells={o}
        index={i}
        tableCols={this.props.tableCols}
        selected={
          o.ID ? this.state.selectedRow === o.ID : this.state.selectedRow === i
        }
        handleClick={this.onRowClick}
      />
    ));

    return (
      <EtsBootstrap.Row>
        <EtsTableDataContainer>
          <EtsTableWrapNoScroll className="ets_table_wrap">
            <EtsBootstrap.Grid.GridTable fixedWidth id={`${this.props.id}_table`}>
              {this.renderHeader()}
              <tbody>{rows}</tbody>
            </EtsBootstrap.Grid.GridTable>
          </EtsTableWrapNoScroll>
        </EtsTableDataContainer>
      </EtsBootstrap.Row>
    );
  }
}

const TrRow = (props) => {
  const cells = [];
  const renderers = props.renderers ? props.renderers : {};

  if (props.tableCols !== undefined) {
    _.each(props.tableCols, (col) => {
      const v = props.cells[col];
      if (renderers[col] === undefined) {
        cells.push(
          <EtsBootstrap.Grid.GridBootstrapTbody.Td key={cells.length}>
            {v}
          </EtsBootstrap.Grid.GridBootstrapTbody.Td>,
        );
      } else {
        cells.push(
          <EtsBootstrap.Grid.GridBootstrapTbody.Td key={cells.length}>
            {renderers[col](v, props.cells, props.index)}
          </EtsBootstrap.Grid.GridBootstrapTbody.Td>,
        );
      }
    });
  } else {
    _.each(props.cells, (v, k) => {
      if (k !== 'id') {
        if (renderers[k] === undefined) {
          cells.push(
            <EtsBootstrap.Grid.GridBootstrapTbody.Td key={cells.length}>
              {v}
            </EtsBootstrap.Grid.GridBootstrapTbody.Td>,
          );
        } else {
          cells.push(
            <EtsBootstrap.Grid.GridBootstrapTbody.Td key={cells.length}>
              {renderers[k](v)}
            </EtsBootstrap.Grid.GridBootstrapTbody.Td>,
          );
        }
      }
    });
  }

  const handleClick = React.useCallback(
    () => {
      props.handleClick(props.cells.ID || props.index);
    },
    [props.cells.ID || props.index],
  );

  return (
    <EtsBootstrap.Grid.GridBootstrapTbody.Tr
      enable
      isSelected={props.selected}
      onClick={handleClick}
      registryKey={'any'}
    >
      {cells}
    </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
  );
};

export default Table;
