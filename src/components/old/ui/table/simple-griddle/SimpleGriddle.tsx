import * as React from 'react';
import * as cx from 'classnames';
import { isArray } from 'util';

import TrTable from 'components/old/ui/table/simple-griddle/tr-table/TrTable';
import TrTableFuelCardsReport from './tr-table/TrTableFuelCardsReport';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ThOverlayTrigger } from 'components/new/ui/registry/components/data/table-data/table-container/@new/thead/th/ThDefault';
import { generateRandomKey } from 'utils/functions';

require('components/old/ui/table/simple-griddle/SimpleGriddle.scss');

const emptyArr = [];

const mapRows = (rows, selectField, parentId = null) => (
  rows.map(({ children = emptyArr, ...other }) => {
    const rowData = {
      ...other,
    };

    if (children.length) {
      rowData._isParent = true;
      rowData._isShowChildren = false;
      rowData.children = mapRows(
        children,
        selectField,
        rowData[selectField],
      );
    }

    if (parentId) {
      rowData._parentId = parentId;
    }

    return rowData;
  })
);

const makeShortResults = (results, currentPage, resultsPerPage, selectField) => (
  mapRows(
    calcCurrentIndex(results).slice(
      currentPage * resultsPerPage,
      (currentPage + 1) * resultsPerPage,
    ),
    selectField,
  )
);

const calcCurrentIndex = (results) => {
  if(!results[0]?.rows) {
    return results;
  }

  let acc = 0;
  return results.map((el, i) => {
    if(i) {
      el.currentIndex = acc + results[i-1].rows.length;
      acc += results[i-1].rows.length;
      return el;
    } else {
      el.currentIndex = 0;
      return el;
    }
  });
};

class SimpleGriddle extends React.Component<any, any> {
  constructor(props) {
    super(props);
    const results = props.results;
    const { resultsPerPage } = props;
    const currentPage = props.rowNumberOffset ? props.rowNumberOffset / resultsPerPage : 0;

    this.state = {
      results,
      resultsPerPage,
      shortResult: makeShortResults(results, currentPage, resultsPerPage, this.props.selectField),
      initialSort: this.props.initialSort,
      initialSortAscending: this.props.initialSortAscending,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { results, resultsPerPage } = nextProps;
    if (results !== prevState.results || resultsPerPage !== prevState.resultsPerPage) {
      const currentPage = nextProps.serverPagination
        ? 0
        : (
          Math.max(
            Math.min(
              nextProps.currentPage,
              Math.ceil(results.length / resultsPerPage) - 1,
            ),
            0,
          )
        );

      const shortResult = makeShortResults(
        results,
        currentPage,
        resultsPerPage,
        nextProps.selectField,
      );
      return {
        results,
        resultsPerPage,
        shortResult,
      };
    }

    return null;
  }

  globalCheckHandler = (e) => {
    this.props.globalCheckHandler(
      this.state.shortResult,
      e,
    );
  };

  getGlobalCheckboxState = (shortResult) => shortResult.length && !shortResult.some((item) => !item.isChecked);

  mapTheadTrTh = (columnNameOuter) => {
    // При переключении страницы, чекбокс не ставится
    const field = this.props.columnMetadata.find((meta) => meta.columnName === columnNameOuter);
    const { columnName, sortByName } = field;
    const { shortResult } = this.state;

    if (columnName === 'isChecked') {
      const isCheckedAll = this.getGlobalCheckboxState(shortResult);
      return (
        <EtsBootstrap.Grid.GridBootstrapThead.Th key={generateRandomKey()} data-title={columnName} canClick={field.sortable} className={cx(field.cssClassName, { sortable: field.sortable })}>
          <input id="checkedColumn" type="checkbox" onChange={this.globalCheckHandler} checked={isCheckedAll} />
        </EtsBootstrap.Grid.GridBootstrapThead.Th>
      );
    }

    return (
      <EtsBootstrap.Grid.GridBootstrapThead.Th key={generateRandomKey()} canClick={field.sortable} data-title={columnName} className={cx(field.cssClassName, { sortable: field.sortable })} onClick={this.handleThClick}>
        {field.displayName}
        {
          this.state.initialSort === sortByName
            ? <EtsBootstrap.Glyphicon glyph={!this.props.initialSortAscending ? 'sort-by-attributes-alt' : 'sort-by-attributes'} />
            :            <span></span>
        }
        {field.fieldTitlePopup && <ThOverlayTrigger>
          <EtsBootstrap.OverlayTrigger
            trigger={['hover', 'focus']}
            overlay={(
              <EtsBootstrap.Popover id={`${columnName}_title-popover`} >
                {field.fieldTitlePopup}
              </EtsBootstrap.Popover>
            )}
            placement="bottom">
            <EtsBootstrap.Glyphicon glyph="info-sign" />
          </EtsBootstrap.OverlayTrigger>
        </ThOverlayTrigger>}
      </EtsBootstrap.Grid.GridBootstrapThead.Th>
    );
  };

  mapTbodyTr = (rowData, index) => (
    <TrTable
      key={generateRandomKey()}
      columns={this.props.columns}
      checked={this.props.checked}
      rowData={rowData}
      index={index}
      rowMetadata={this.props.rowMetadata}
      handleClickTbodyTr={this.handleClickTbodyTr}
      onRowDoubleClick={this.onRowDoubleClick}
      columnMetadata={this.props.columnMetadata}
      rowNumberOffset={this.props.rowNumberOffset}
      handleRowCheck={this.props.handleRowCheck}
      selectField={this.props.selectField}
      currentPage={this.props.currentPage}
      resultsPerPage={this.state.resultsPerPage}
      localState={this.props.localState}
      cellColors={this.props.cellColors}
    />
  );
 
  reduceTbodyTrFuelCardsReport = (objData: { array: Array<any>; index: number; }, rowData, indexArr) => {
    objData.array.push(
      <TrTableFuelCardsReport
        key={generateRandomKey()}
        columns={this.props.columns}
        rowData={rowData}
        index={objData.index}
        currentIndex={rowData.currentIndex || objData.index}
        rowMetadata={this.props.rowMetadata}
        handleClickTbodyTr={this.handleClickTbodyTr}
        onRowDoubleClick={this.onRowDoubleClick}
        columnMetadata={this.props.columnMetadata}
        rowNumberOffset={this.props.rowNumberOffset}
        handleRowCheck={this.props.handleRowCheck}
        selectField={this.props.selectField}
        currentPage={this.props.currentPage}
        resultsPerPage={this.state.resultsPerPage}
      />,
    );
    objData.index = objData.index + rowData.rows.length;

    return objData;
  };

  onRowDoubleClick: any = (rowData, index) => {
    const { onRowDoubleClick } = this.props;

    if (onRowDoubleClick) {
      const {
        _isParent,
        _isShowChildren,
        isChecked,
        isHighlighted,
        isSelected,
        ...data
      } = rowData;
      onRowDoubleClick({ props: { data }});
    }
  };
  handleClickTbodyTr: any = (rowData, index) => {
    const numberIndex = index;
    const rowNumber = (this.props.rowNumberOffset || (this.props.currentPage || 0) * this.props.resultsPerPage) + index + 1;

    if (!rowData._isParent) {
      if (this.props.onRowClickNew || this.props.onRowClick) {
        const {
          _isParent,
          _isShowChildren,
          isChecked,
          isHighlighted,
          isSelected,
          ...data
        } = rowData;
        try {
          this.props.onRowClickNew({
            props: {
              data,
            },
          }, rowNumber);
        } catch (e) {
          this.props.onRowClick({
            props: {
              data,
            },
          }, rowNumber);
        }
      }
    } else {
      let shortResult = [];

      if (!rowData._isShowChildren) {
        shortResult = [
          ...this.state.shortResult.slice(0, numberIndex),
          {
            ...rowData,
            _isShowChildren: true,
          },
          ...rowData.children,
          ...this.state.shortResult.slice(numberIndex + 1),
        ];
      } else {
        shortResult = this.state.shortResult.reduce((newArr, newRowData) => {
          if (newRowData[this.props.selectField] === rowData[this.props.selectField]) {
            newRowData._isShowChildren = false;
          }
          if (newRowData._parentId !== rowData[this.props.selectField]) {
            newArr.push(newRowData);
          }

          return newArr;
        }, []);
      }

      this.setState({
        shortResult,
      });
    }
  };

  handleThClick: any = ({ currentTarget: { dataset: { title } } }) => {
    if (this.props.enableSort) {
      const fieldMeta = this.props.columnMetadata.find(({ columnName }) => columnName === title);

      if (fieldMeta && fieldMeta.sortable) {
        const initialSortAscending = fieldMeta.sortByName === this.state.initialSort ? !this.state.initialSortAscending : true;

        console.info('CHANGE SORT', fieldMeta.sortByName, initialSortAscending); // eslint-disable-line

        this.props.externalChangeSort(fieldMeta.sortByName, initialSortAscending);
        this.setState({
          initialSort: fieldMeta.sortByName,
          initialSortAscending,
        });
      }
    }
  };

  render() {
    const {
      shortResult,
    } = this.state;

    let theadTrData = null;
    let tbodyData = null;
    const deepArr = shortResult.some(({ rows }) => isArray(rows));

    if (deepArr) {
      theadTrData = this.props.columns.map(this.mapTheadTrTh);
      tbodyData = shortResult.reduce(this.reduceTbodyTrFuelCardsReport, { array: [], index: 0 }).array;
    } else {
      theadTrData = this.props.columns.map(this.mapTheadTrTh);
      tbodyData = shortResult.map(this.mapTbodyTr);
    }

    return (
      <div className="griddle simple-griddle">
        <div className="griddle-container">
          <div className="griddle-body">
            <div>
              <table>
                <thead>
                  <tr>
                    { theadTrData }
                  </tr>
                </thead>
                <tbody>
                  {
                    !shortResult.length
                      ? (
                        <tr>
                          <td colSpan={this.props.columns
                            ? this.props.columns.length
                            : 0}>{this.props.noDataMessage}</td>
                        </tr>
                      )
                      : tbodyData
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SimpleGriddle;
