import * as React from 'react';
import TrBody from 'components/old/ui/tableNew/table/tbody/trBody/TrBody';
import TrBodyAllRow from 'components/old/ui/tableNew/table/tbody/trBody/TrBodyAllRow';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class Tbody extends React.Component<any, any> {
  renderTr = (summObj, rowData) => {
    if (rowData.toggle) {
      if (rowData.allRow) {
        summObj.arr.push(
          <TrBodyAllRow
            key={rowData[this.props.uniqName]}
            rowData={rowData}
            handleClick={this.props.toggleChildren}
          />,
        );
        if (!rowData.showChildren) {
          summObj.indexRow += rowData.children.length;
        }
      } else {
        summObj.arr.push(
          <TrBody
            key={rowData[this.props.uniqName]}
            indexRow={rowData.noIndexRow ? '' : (summObj.indexRow + this.props.offset)}
            rowData={rowData}
            tableMeta={this.props.tableMeta}
            handleClick={this.props.toggleChildren}
            selected={this.props.selected}
            uniqName={this.props.uniqName}
          />,
        );
        summObj.indexRow += rowData.noIndexRow ? 0 : 1;
      }
    } else {
      summObj.arr.push(
        <TrBody
          key={rowData[this.props.uniqName]}
          indexRow={rowData.noIndexRow ? '' : (summObj.indexRow + this.props.offset)}
          rowData={rowData}
          tableMeta={this.props.tableMeta}
          handleClick={this.props.handleClick}
          handleDoubleClick={this.props.handleDoubleClick}
          selected={this.props.selected}
          uniqName={this.props.uniqName}
        />,
      );
      summObj.indexRow += rowData.noIndexRow ? 0 : 1;
    }

    return summObj;
  };

  render() {
    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
        {
          this.props.hasData
            ?          this.props.data.reduce(this.renderTr, { arr: [], indexRow: 1 }).arr
            :          <EtsBootstrap.Grid.GridBootstrapTbody.Tr registryKey="none">
              <EtsBootstrap.Grid.GridBootstrapTbody.Td colSpan={9999}>{'Нет данных'}</EtsBootstrap.Grid.GridBootstrapTbody.Td>
            </EtsBootstrap.Grid.GridBootstrapTbody.Tr>
        }
      </EtsBootstrap.Grid.GridBootstrapTbody.Tbody>
    );
  }
}

export default Tbody;
