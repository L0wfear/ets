import * as React from 'react';
import TdBody from 'components/ui/tableNew/table/tbody/trBody/tdBody/TdBody';
import * as cx from 'classnames';

class TrBody extends React.Component<any, any> {
  renderTd = (tableMeta, index) => (
    <TdBody
      key={`${tableMeta.name}.${index}`}
      data={this.props.rowData[tableMeta.name]}
      rowData={this.props.rowData}
      tableMeta={tableMeta}
      render={tableMeta.render}
      indexRow={this.props.indexRow}
    />
  )

  handleClick = () => this.props.handleClick(this.props.rowData);
  handleDoubleClick = () => this.props.handleDoubleClick(this.props.rowData);

  render() {
    const {
      rowData,
      selected,
      uniqName,
    } = this.props;
    const { [uniqName]: id_selected } = selected || {};
    const { [uniqName]: id_rowData } = rowData;

    const className = cx(
      { selected: id_selected === id_rowData },
      rowData.className,
    );

    return (
      <tr className={className} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} >
        { this.props.tableMeta.cols.map(this.renderTd) }
      </tr>
    );
  }
}

export default TrBody;
