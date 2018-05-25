import * as React from 'react';

class TrBody extends React.Component<any, any> {
  handleClick = () => this.props.handleClick(this.props.rowData);

  render() {
    return (
      <tr onClick={this.handleClick} >
        <td colSpan={999999}>{this.props.rowData.displayName}</td>
      </tr>
    );
  }
}

export default TrBody;
