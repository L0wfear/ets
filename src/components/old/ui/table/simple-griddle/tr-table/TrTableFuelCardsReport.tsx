import * as React from 'react';
import * as cx from 'classnames';
import { TrFuelCardReportTitle, TrFuelCardReportFooter } from '../styled';

type PropsTrTableFuelCardsReport = {
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
};

class TrTableFuelCardsReport extends React.Component<PropsTrTableFuelCardsReport, any> {
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
      rowData: {
        __title_rows,
        rows,
        __footer_rows,
      },
      index,
    } = this.props;

    const rowNumber = (this.props.rowNumberOffset || (this.props.currentPage || 0) * this.props.resultsPerPage) + index + 1;

    return (
      <>
        { /* Формат строки: «[Рег. номер ТС] ([Гар. номер ТС]), [Модель ТС]. Организация: [Организация]. Район: [Район]. Округ: [Округ]» */ }
        {
          __title_rows.map(({ title }) => (
            <TrFuelCardReportTitle key={title}>
              <td></td>
              <td colSpan={999}>{ title }</td>
            </TrFuelCardReportTitle>
          ))
        }
        {
          rows.map((rowData, rowIndex) => {
            return (
              <tr key={rowNumber + rowIndex} className={cx(this.props.rowMetadata.bodyCssClassName(rowData))}>
                {
                  this.props.columns.map((columnNameOuter, colIndex) => {
                    const field = this.props.columnMetadata.find((meta) => meta.columnName === columnNameOuter);

                    const { columnName, cssClassName, customComponent } = field;

                    return (
                      <td key={columnName} className={cx(cssClassName, this.props.rowMetadata.tdCssClassName([columnName, rowData[columnName]]))}>
                        {
                          (() => {
                            if (typeof customComponent === 'function') {
                              return customComponent({ rowData: { ...rowData, rowNumber }, data: rowData[columnName] });
                            }

                            if (columnName === 'rowNumber') {
                              return rowNumber + rowIndex;
                            }

                            return Boolean(rowData[columnName]) || rowData[columnName] === 0 ? rowData[columnName] : '-';

                          })()
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
        {
          __footer_rows.map((footerRow, indexFooter) => {
            if (footerRow.title) {
              return (
                <TrFuelCardReportFooter key={footerRow.title}>
                  <td></td>
                  <td colSpan={999}>{footerRow.title || ''}</td>
                </TrFuelCardReportFooter>
              );
            }
            return (
              <TrFuelCardReportFooter key={indexFooter + 1}>
                {
                  this.props.columns.map((columnNameOuter, indexFooterColumn) => {
                    const field = this.props.columnMetadata.find((meta) => meta.columnName === columnNameOuter);

                    const { columnName } = field;
                    const footerRowData = footerRow[columnName];

                    if (footerRowData) {
                      if (footerRowData.type === 'value') {
                        return (
                          <td key={columnName}>{footerRowData.value}</td>
                        );
                      }

                      if (footerRowData.type === 'agg') {
                        return (
                          <td key={columnName}>{rows.reduce((summ, rowData) => {
                            const fieldInRowData = rowData[columnName];
                            if ((+fieldInRowData || +fieldInRowData === 0) && !isNaN(+fieldInRowData)) {
                              return summ + fieldInRowData;
                            }

                            return summ;
                          }, 0)}</td>
                        );
                      }
                    }

                    return (
                      <td key={indexFooterColumn + 1}>{''}</td>
                    );
                  })
                }
              </TrFuelCardReportFooter>
            );
          })
        }
      </>
    );
  }

}

export default TrTableFuelCardsReport;
