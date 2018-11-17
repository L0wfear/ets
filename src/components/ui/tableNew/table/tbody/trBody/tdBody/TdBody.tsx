import * as React from 'react';
import * as cx from 'classnames';

class TdBody extends React.Component<any, any> {

  static get defaultProps() {
    return {
      render: ({ data, rowData, tableMeta }) => data,
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
      <td className={tdClassName}>{this.props.render(this.props)}</td>
    );
  }
}

export default TdBody;
