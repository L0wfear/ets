import * as React from 'react';
import * as cx from 'classnames';

class TrBody extends React.Component<any, any> {
  handleClick = () => this.props.handleClick(this.props.rowData);

  render() {
    const { rowData } = this.props;
    const className = cx(
      rowData.className,
    );

    return (
      <tr className={className} onClick={this.handleClick} >
        <td colSpan={999999}>{rowData.displayName}</td>
      </tr>
    );
  }
}

export default TrBody;
