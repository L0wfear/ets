import * as React from 'react';
import * as cx from 'classnames';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class TrBody extends React.Component<any, any> {
  handleClick = () => this.props.handleClick(this.props.rowData);

  render() {
    const { rowData } = this.props;
    const className = cx(
      rowData.className,
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Tr className={className} onClick={this.handleClick} registryKey="none">
        <EtsBootstrap.Grid.GridBootstrapTbody.Td colSpan={999999}>{rowData.displayName}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
      </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
    );
  }
}

export default TrBody;
