import * as React from 'react';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import {
  EtsTable,
  EtsTableWrapNoScroll,
} from 'components/new/ui/registry/components/data/table-data/table-container/styled/styled';
import { EtsThead } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/styled/styled';
import { EtsTrTbody } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/styled/styled';
import { EtsTbodyTrTd } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { EtsTableDataContainer } from 'components/new/ui/registry/components/data/table-data/styled/styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export default class Table extends React.Component {
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

  onRowClick(id) {
    if (this.props.onRowSelected !== undefined) {
      this.setState({
        selectedRow: id,
      });
      this.props.onRowSelected(id);
    }
  }

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
      handleClick: this.setPage.bind(this),
    };
  }

  setPage(num) {
    this.setState({
      currentPage: num,
    });
  }

  renderHeader() {
    return (
      <EtsThead className="ets-table-header">
        {this.props.columnCaptions.map((o, i) => {
          return (
            <EtsTheadTh key={i} width={o.width} className={o.className}>
              {o.value}
            </EtsTheadTh>
          );
        })}
      </EtsThead>
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
        handleClick={this.onRowClick.bind(this)}
      />
    ));

    return (
      <EtsBootstrap.Row>
        <EtsTableDataContainer>
          <EtsTableWrapNoScroll className="ets_table_wrap">
            <EtsTable fixedWidth>
              {this.renderHeader()}
              <tbody>{rows}</tbody>
            </EtsTable>
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
        cells.push(<EtsTbodyTrTd key={cells.length}>{v}</EtsTbodyTrTd>);
      } else {
        cells.push(
          <EtsTbodyTrTd key={cells.length}>
            {renderers[col](v, props.cells, props.index)}
          </EtsTbodyTrTd>,
        );
      }
    });
  } else {
    _.each(props.cells, (v, k) => {
      if (k !== 'id') {
        if (renderers[k] === undefined) {
          cells.push(<EtsTbodyTrTd key={cells.length}>{v}</EtsTbodyTrTd>);
        } else {
          cells.push(
            <EtsTbodyTrTd key={cells.length}>{renderers[k](v)}</EtsTbodyTrTd>,
          );
        }
      }
    });
  }

  return (
    <EtsTrTbody
      enable
      selected={props.selected}
      onClick={props.handleClick.bind(this, props.cells.ID || props.index)}>
      {cells}
    </EtsTrTbody>
  );
};
