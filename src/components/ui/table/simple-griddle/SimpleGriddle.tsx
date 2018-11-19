import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import * as cx from 'classnames';
import TrTable from 'components/ui/table/simple-griddle/tr-table/TrTable';

import {
  DivNone,
} from 'global-styled/global-styled';
import { isNullOrUndefined } from 'util';

require('components/ui/table/simple-griddle/SimpleGriddle.scss');

const emptyArr = [];

const mapRows = (rows, selectField, parentId = null) => (
  rows.map(({ children = emptyArr, ...other }) => {
    const rowData = {
      ...other
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
      currentPage,
      results,
      resultsPerPage,
      shortResult: makeShortResults(results, currentPage, resultsPerPage, this.props.selectField),
      initialSort: this.props.initialSort,
      initialSortAscending: this.props.initialSortAscending,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { results, resultsPerPage } = nextProps;

    if (results !== this.state.results || resultsPerPage !== this.state.resultsPerPage) {
      const currentPage = nextProps.serverPagination
        ? nextProps.rowNumberOffset / resultsPerPage
        : (
          Math.max(
            Math.min(
              this.state.currentPage,
              Math.ceil(results.length / resultsPerPage) - 1
            ),
            0,
          )
        );


      this.setState({
        results,
        resultsPerPage,
        currentPage,
        shortResult: makeShortResults(results, nextProps.serverPagination ? 0 : currentPage, resultsPerPage, this.props.selectField),
      });
    }
  }

  setPage = (currentPage) => (
    this.setState({
      currentPage,
      shortResult: makeShortResults(this.state.results, currentPage, this.state.resultsPerPage, this.props.selectField),
    })
  )

  mapTheadTrTh = (columnNameOuter) => {
    const field = this.props.columnMetadata.find(({ columnName }) => columnName === columnNameOuter);

    const { columnName } = field;

    return (
      <th key={columnName} data-title={columnName} className={cx(field.cssClassName, { sortable: field.sortable })} onClick={this.handleThClick}>
        {field.displayName}
        {
          this.state.initialSort === columnName ?
            <Glyphicon glyph={`sort-by-attributes${!this.state.initialSortAscending ? '-alt' : ''}`} />
          :
            <span></span>
        }
      </th>
    )
  }

  mapTbodyTr = (rowData, index) => (
    <TrTable
      key={isNullOrUndefined(rowData[this.props.selectField]) ? index : rowData[this.props.selectField]}
      columns={this.props.columns}
      rowData={rowData}
      index={index}
      rowMetadata={this.props.rowMetadata}
      handleClickTbodyTr={this.handleClickTbodyTr}
      onRowDoubleClick={this.onRowDoubleClick}
      columnMetadata={this.props.columnMetadata}
      rowNumberOffset={this.props.rowNumberOffset}
      handleRowCheck={this.props.handleRowCheck}
      selectField={this.props.selectField}
      currentPage={this.state.currentPage}
      resultsPerPage={this.state.resultsPerPage}
    />
  )

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
    const { _isParent } = rowData;

    if (!_isParent) {
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
          ...this.state.shortResult.slice(numberIndex + 1)
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
        const initialSortAscending = title === this.state.initialSort ? !this.state.initialSortAscending : true;

        // tslint:disable-next-line
        console.log('CHANGE SORT', title, initialSortAscending);

        this.props.externalChangeSort(title, initialSortAscending);
        this.setState({
          initialSort: title,
          initialSortAscending: initialSortAscending,
        })
      }
    } 
  }
  render() {
    const {
      currentPage,
      shortResult,
    } = this.state;

    const { customPagerComponent: PaginatorWrap } = this.props;

    return (
      <div className="griddle simple-griddle">
        <div className="griddle-container">
          <div className="griddle-body">
            <div>
              <table>
                <thead>
                  <tr>
                    { this.props.columns.map(this.mapTheadTrTh) }
                  </tr>
                </thead>
                <tbody>
                  {
                    !shortResult.length ?
                    (
                      <tr>
                        <td colSpan={99999}>{this.props.noDataMessage}</td>
                      </tr>
                    )
                    :
                    shortResult.map(this.mapTbodyTr)
                  }
                </tbody>
              </table>
              {
                PaginatorWrap ?
                (
                  <PaginatorWrap
                    uniqKey={this.props.uniqKey}
                    currentPage={currentPage}
                    maxPage={Math.ceil(this.props.results.length / this.props.resultsPerPage)}
                    setPage={this.setPage}
                  />
                )
                :
                (
                  <DivNone />
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SimpleGriddle;
