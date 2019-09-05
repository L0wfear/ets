import * as React from 'react';
import TrHead from 'components/old/ui/tableNew/table/thead/trHead/TrHead';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class Thead extends React.Component<any, any> {
  renderTr = (rowData, index) => (
    <TrHead
      key={index}
      rowData={rowData}
      handleClick={this.props.handleClick}
      sortField={this.props.sortField}
      sortAscending={this.props.sortAscending}
    />
  )

  render() {
    return (
      <EtsBootstrap.Grid.GridBootstrapThead.Thead>
        { this.props.tableMeta.map(this.renderTr) }
      </EtsBootstrap.Grid.GridBootstrapThead.Thead>
    );
  }
}

export default Thead;
