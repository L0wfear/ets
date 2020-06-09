import * as React from 'react';
import * as cx from 'classnames';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { isNullOrUndefined } from 'util';

type PropsTrTable = {
  rowData: any;
  index: number;
  rowNumberOffset: number;
  rowMetadata: any;
  columnMetadata: any;
  handleClickTbodyTr: any;
  onRowDoubleClick: any;
  handleRowCheck: any;
  selectField: string;
  currentPage: number;
  resultsPerPage: number;
  columns: Array<string>;

  checked: any;
  localState: Record<string, any>;
};

class TrTable extends React.Component<PropsTrTable, any> {
  handleClickTbodyTr: React.MouseEventHandler<HTMLTableRowElement> = () => {
    const { props } = this;

    this.props.handleClickTbodyTr(
      props.rowData,
      props.index,
    );
  };
  handleDoubleClickTbodyTr: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
    const { props } = this;

    this.props.onRowDoubleClick(
      props.rowData,
      props.index,
    );
  };

  handleRowCheck: any = () => {
    const { props } = this;

    props.handleRowCheck(props.rowData[props.selectField] || props.index);
  };

  render() {
    const {
      rowData,
      index,
    } = this.props;

    const rowNumber = (this.props.rowNumberOffset || (this.props.currentPage || 0) * this.props.resultsPerPage) + index + 1;

    return (
      <tr
        className={cx(
          {
            'parent-row': rowData._isParent,
            'child-row': rowData._parentId,
          },
          this.props.rowMetadata.bodyCssClassName(rowData, this.props.checked[rowData[this.props.selectField]]),
        )}
        onClick={this.handleClickTbodyTr}
        onDoubleClick={this.handleDoubleClickTbodyTr}
      >
        {
          this.props.columns.map((columnNameOuter, colIndex) => {
            const field = this.props.columnMetadata.find((meta) => meta.columnName === columnNameOuter);

            const { columnName, customComponent, cssClassName } = field;

            return (
              <td key={columnName} className={cx(cssClassName, this.props.rowMetadata.tdCssClassName([columnName, rowData[columnName]]))}>
                {
                  rowData._isParent && colIndex === 0
                    ? (
                      rowData._isShowChildren
                        ? (
                          <EtsBootstrap.Glyphicon glyph="triangle-bottom" />
                        )
                        :                  (
                          <EtsBootstrap.Glyphicon glyph="triangle-right" />
                        )
                    )
                    :                (
                      <span></span>
                    )
                }
                {
                  customComponent
                    ? typeof rowData[columnName] === 'number'
                      ? customComponent({ rowData: {...rowData, rowNumber}, data: rowData[columnName] }, this.props).toString().replace('.', ',')
                      : customComponent({ rowData: {...rowData, rowNumber}, data: rowData[columnName] }, this.props)
                    : columnName === 'rowNumber'
                      ? rowNumber
                      : columnName === 'isChecked'
                        ? (
                          <div>
                            <input
                              type="checkbox"
                              readOnly
                              id={`checkbox-${rowData[this.props.selectField] || index}`}
                              checked={Boolean(rowData.isChecked)}
                              onClick={this.handleRowCheck}
                            />
                          </div>
                        )
                        : typeof rowData[columnName] === 'number' 
                          ? rowData[columnName].toString().replace('.', ',')
                          : (!isNullOrUndefined(rowData[columnName]) ? rowData[columnName] : '').toString()
                }
              </td>
            );
          })
        }
      </tr>
    );
  }
}

export default TrTable;
