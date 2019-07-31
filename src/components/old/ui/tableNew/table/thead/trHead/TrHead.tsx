import * as React from 'react';
import ThHead from 'components/old/ui/tableNew/table/thead/trHead/thHEad/ThHead';

class TrHead extends React.Component<any, any> {
  renderTh = (thData, index) => (
    <ThHead
      key={`${thData.name}.${index}`}
      thData={thData}
      handleClick={this.props.handleClick}
      sortField={this.props.sortField}
      sortAscending={this.props.sortAscending}
    />
  )

  render() {

    return (
      <tr>
        { this.props.rowData.cols.map(this.renderTh)}
      </tr>
    );
  }
}

export default TrHead;
