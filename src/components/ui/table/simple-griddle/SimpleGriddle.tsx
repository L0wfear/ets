import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import cx from 'classnames';

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
        other[selectField],
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
    const currentPage = props.rowNumberOffset || 0;
    const results = props.results;
    const { resultsPerPage } = props;
    
    this.state = {
      currentPage,
      results,
      resultsPerPage,
      shortResult: makeShortResults(results, currentPage, resultsPerPage, this.props.selectField),
    };
  }
  componentWillReceiveProps(nextProps) {
    const { results, resultsPerPage } = nextProps;

    if (results !== this.state.results || resultsPerPage !== this.state.resultsPerPage) {
      const { currentPage } = this.state;

      this.setState({
        results,
        resultsPerPage,
        shortResult: makeShortResults(results, currentPage, resultsPerPage, this.props.selectField),
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
          this.props.initialSort === columnName ?
            <Glyphicon glyph={`sort-by-attributes${!this.props.initialSortAscending ? '-alt' : ''}`} />
          :
            <span></span>
        }
      </th>
    )
  }

  mapTbodyTr = ({ children = emptyArr, ...rowData }, index) => (
    <tr key={rowData[this.props.selectField] || index} data-index={index} className={cx({ 'selected-row': rowData.isSelected, 'parent-row': rowData._isParent, 'child-row': rowData._parentId }, this.props.rowMetadata.bodyCssClassName(rowData))} onClick={this.handleCLickTbodyTr}>
      {
        this.props.columnMetadata.map(({ columnName, customComponent }, colIndex) => (
            <td key={columnName} className={cx(this.props.rowMetadata.tdCssClassName([columnName, rowData[columnName]]))}>
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
                  (this.props.rowNumberOffset || this.state.currentPage * this.state.resultsPerPage) + index + 1
                  :
                    columnName === 'isChecked' ?
                    (
                      <div>
                        <input
                          type="checkbox"
                          readOnly
                          id={`checkbox-${rowData[this.props.selectField] || index}`}
                          data-id={rowData[this.props.selectField] || index}
                          checked={rowData.isChecked}
                          onClick={this.props.handleRowCheck}
                        />
                      </div>
                    )
                    :
                    rowData[columnName]
              }
            </td>
          ))
      }
    </tr>
  )

  handleCLickTbodyTr: any = ({ currentTarget: { dataset: { index } } }) => {
    const numberIndex = Number(index);
    const data = this.state.shortResult[(this.props.rowNumberOffset || this.state.currentPage * this.props.resultsPerPage) + numberIndex];
    const { _isParent } = data;

    if (this.props.onRowClick) {
      if (!_isParent) {
        this.props.onRowClick({
          props: {
            data,
          },
        });
      } else {
        console.warn('нужно обработать случай')
      }
    } else if (_isParent) {
      let shortResult = [];

      if (!data._isShowChildren) {
        shortResult = [
          ...this.state.shortResult.slice(0, numberIndex),
          {
            ...data,
            _isShowChildren: true,
          },
          ...data.children,
          ...this.state.shortResult.slice(numberIndex + 1)
        ];
      } else {
        shortResult = this.state.shortResult.reduce((newArr, {...rowData}) => {
          if (data[this.props.selectField] === rowData[this.props.selectField]) {
            rowData._isShowChildren = false;
          }
          if (rowData._parentId !== data[this.props.selectField]) {
            newArr.push(rowData);
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
        const initialSortAscending = title === this.props.initialSort ? !this.props.initialSortAscending : true;

        this.props.externalChangeSort(title, initialSortAscending);
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
                  <div className="none"></div>
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
