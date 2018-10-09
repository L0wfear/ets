import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';

type PropsTrTable = {
  rowData: any;
  index: number;
  rowNumberOffset: number;
  rowMetadata: any;
  columnMetadata: any;
  handleClickTbodyTr: (rowData: any, index: number) => any;
  onRowDoubleClick: (rowData: any, index: number) => any;
  handleRowCheck: (id: number | string) => any;
  selectField: string;
  currentPage: number;
  resultsPerPage: number;
  columns: string[];
}

class TrTable extends React.Component<PropsTrTable, any> {
  handleClickTbodyTr: React.MouseEventHandler<HTMLTableRowElement> = () => {
    const { props } = this;

    this.props.handleClickTbodyTr(
      props.rowData,
      props.index,
    )
  }
  handleDoubleClickTbodyTr: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
    const { props } = this;

    this.props.onRowDoubleClick(
      props.rowData,
      props.index,
    );
  }

  handleRowCheck: any = () => {
    const { props } = this;

    props.handleRowCheck(props.rowData[props.selectField] || props.index);
  }

  render() {
    const {
      rowData,
      index,
    } = this.props;

    return (
      <tr
        className={cx(
          {
            'parent-row': rowData._isParent,
            'child-row': rowData._parentId,
          },
          this.props.rowMetadata.bodyCssClassName(rowData),
        )}
        onClick={this.handleClickTbodyTr}
        onDoubleClick={this.handleDoubleClickTbodyTr}
      >
      {
        this.props.columns.map((columnNameOuter, colIndex) => {
          const field = this.props.columnMetadata.find(({ columnName }) => columnName === columnNameOuter);

          const { columnName, customComponent, cssClassName } = field;

          return (
            <td key={columnName} className={cx(cssClassName, this.props.rowMetadata.tdCssClassName([columnName, rowData[columnName]]))}>
              {
                rowData._isParent && colIndex === 0 ?
                (
                  rowData._isShowChildren ?
                  (
                    <Glyphicon glyph="triangle-bottom" />
                  )
                  :
                  (
                    <Glyphicon glyph="triangle-right" />
                  )
                )
                :
                (
                  <span></span>
                )
              }
              {
                customComponent ?
                  customComponent({ rowData, data: rowData[columnName] })
                :
                  columnName === 'rowNumber' ?
                  (this.props.rowNumberOffset || this.props.currentPage * this.props.resultsPerPage) + index + 1
                  :
                    columnName === 'isChecked' ?
                    (
                      <div>
                        <input
                          type="checkbox"
                          readOnly
                          id={`checkbox-${rowData[this.props.selectField] || index}`}
                          checked={rowData.isChecked}
                          onChange={this.handleRowCheck}
                        />
                      </div>
                    )
                    :
                    rowData[columnName]
              }
            </td>
          )
        })
      }
    </tr>
    )
  }
}

export default TrTable;
