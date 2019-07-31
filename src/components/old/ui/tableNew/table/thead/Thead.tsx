import * as React from 'react';
import TrHead from 'components/ui/tableNew/table/thead/trHead/TrHead';

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
      <thead>
        { this.props.tableMeta.map(this.renderTr) }
      </thead>
    );
  }
}

export default Thead;
