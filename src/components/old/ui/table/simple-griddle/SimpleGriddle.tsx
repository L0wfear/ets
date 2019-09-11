import * as React from 'react';
import * as cx from 'classnames';
import { isNullOrUndefined, isArray } from 'util';

import TrTable from 'components/old/ui/table/simple-griddle/tr-table/TrTable';
import { EtsTheadTh } from 'components/new/ui/registry/components/data/table-data/table-container/t-head/tr-head/tr-th/styled/styled';
import TrTableFuelCardsReport from './tr-table/TrTableFuelCardsReport';
import EtsBootstrap from 'components/new/ui/@bootstrap';

require('components/old/ui/table/simple-griddle/SimpleGriddle.scss');

const EtsTheadThL: any = EtsTheadTh;

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
    results.slice(
      currentPage * resultsPerPage,
      (currentPage + 1) * resultsPerPage,
    ),
    selectField,
  )
);

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
  }

  getGlobalCheckboxState = (shortResult) => shortResult.length && !shortResult.some((item) => !item.isChecked);

  mapTheadTrTh = (columnNameOuter) => {
    // При переключении страницы, чекбокс не ставится
    const field = this.props.columnMetadata.find((meta) => meta.columnName === columnNameOuter);
    const { columnName, sortByName } = field;
    const { shortResult } = this.state;

    if (columnName === 'isChecked') {
      const isCheckedAll = this.getGlobalCheckboxState(shortResult);
      return (
        <EtsTheadThL key={columnName} data-title={columnName} className={cx(field.cssClassName, { sortable: field.sortable })}>
          <input id="checkedColumn" type="checkbox" onChange={this.globalCheckHandler} checked={isCheckedAll} />
        </EtsTheadThL>
      );
    }

    return (
      <EtsTheadThL canClick key={columnName} data-title={columnName} className={cx(field.cssClassName, { sortable: field.sortable })} onClick={this.handleThClick}>
        {field.displayName}
        {
          this.state.initialSort === sortByName ?
            <EtsBootstrap.Glyphicon glyph={!this.props.initialSortAscending ? 'sort-by-attributes-alt' : 'sort-by-attributes'} />
          :
            <span></span>
        }
      </EtsTheadThL>
    );
  }

  mapTbodyTr = (rowData, index) => (
    <TrTable
      key={isNullOrUndefined(rowData[this.props.selectField]) ? index : rowData[this.props.selectField]}
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
    />
  );

  reduceTbodyTrFuelCardsReport = (objData: { array: any[], index: number }, rowData, indexArr) => {
    objData.array.push(
      <TrTableFuelCardsReport
        key={rowData._uniq_field}
        columns={this.props.columns}
        rowData={rowData}
        index={objData.index}
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
  }

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
  }
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
  }

  handleThClick: any = ({ currentTarget: { dataset: { title } } }) => {
    if (this.props.enableSort) {
      const fieldMeta = this.props.columnMetadata.find(({ columnName }) => columnName === title);

      if (fieldMeta && fieldMeta.sortable) {
        const initialSortAscending = fieldMeta.sortByName === this.state.initialSort ? !this.state.initialSortAscending : true;

        console.log('CHANGE SORT', fieldMeta.sortByName, initialSortAscending); // tslint:disable-line:no-console

        this.props.externalChangeSort(fieldMeta.sortByName, initialSortAscending);
        this.setState({
          initialSort: fieldMeta.sortByName,
          initialSortAscending,
        });
      }
    }
  }

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
                        <td colSpan={99999}>{this.props.noDataMessage}</td>
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
