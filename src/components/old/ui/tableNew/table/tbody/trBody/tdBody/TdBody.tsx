import * as React from 'react';
import * as cx from 'classnames';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { isNullOrUndefined, isNumber } from 'util';

class TdBody extends React.Component<any, any> {

  static get defaultProps() {
    return {
      render: ({ data, rowData, tableMeta }) =>
        (!isNullOrUndefined(data) && !tableMeta.precision
          ? data
          : data && tableMeta.precision && isNumber(data)
            ? data.toFixed(tableMeta.precision)
            : ''
        ).toString()
    };
  }

  render() {
    const { tableMeta } = this.props;
    const showIt = typeof tableMeta.display === 'boolean' ? tableMeta.display : true;

    const tdClassName = cx(
      tableMeta.cssClassName,
      { 'display-none': !showIt, },
    );

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td className={tdClassName}>
        {this.props.render(this.props, this.props)}
      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  }
}

export default TdBody;
