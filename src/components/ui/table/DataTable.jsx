import React, { PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import cx from 'classnames';
import ClickOutHandler from 'react-onclickout';
import Griddle from 'griddle-react';
import { autobind } from 'core-decorators';
import { isEmpty } from 'utils/functions';

import ColumnControl from './ColumnControl.jsx';
import Filter from './filter/Filter.jsx';
import FilterButton from './filter/FilterButton.jsx';
import Paginator from '../Paginator.jsx';
import Div from '../Div.jsx';

@autobind
export default class DataTable extends React.Component {

  /**
   * Свойства компонента
   * @type {Object}
   * @property {Object[]} results - данные
   */
  static get propTypes() {
    return {
      results: PropTypes.array,
      checked: PropTypes.object,
      isHierarchical: PropTypes.bool,
      renderers: PropTypes.object,
      className: PropTypes.string,

      onAllRowsChecked: PropTypes.func,
      onRowChecked: PropTypes.func,
      onRowSelected: PropTypes.func,
      onRefresh: PropTypes.func,
      selected: PropTypes.object,
      selectField: PropTypes.string,

      initialSort: PropTypes.string,
      initialSortAscending: PropTypes.bool,

      children: PropTypes.node,

      enumerated: PropTypes.bool,
      refreshable: PropTypes.bool,
      multiSelection: PropTypes.bool,
      serverPagination: PropTypes.bool,
      noDataMessage: PropTypes.string,

      noFilter: PropTypes.bool,
      noTitle: PropTypes.bool,
      noHeader: PropTypes.bool,
      enableSort: PropTypes.bool,

      title: PropTypes.string,

      tableMeta: PropTypes.object,
      filterValues: PropTypes.object,
      externalFilter: PropTypes.func,
      highlight: PropTypes.array,

      columnControl: PropTypes.bool,
      // TODO реализовать обработку вне
      onColumnControlChange: PropTypes.func,
      // TODO перенести на более высокий уровень абстракции
      columnControlStorageName: PropTypes.string,
    };
  }

  static get defaultProps() {
    return {
      results: [],
      checked: {},
      isHierarchical: false,
      renderers: {},
      className: '',
      title: '',

      onAllRowsChecked: () => {},
      onRowChecked: () => {},
      onRowSelected: () => {},
      onRefresh: () => {},

      selected: null,
      selectField: 'id',

      initialSort: 'id',
      initialSortAscending: true,

      enableSort: true,

      enumerated: true,
      refreshable: false,
      multiSelection: false,
      serverPagination: false,
      noDataMessage: 'Нет данных',

      noFilter: false,
      noHeader: false,
      noTitle: false,

      tableMeta: {},

      columnControl: false,
      // TODO реализовать обработку вне
      onColumnControlChange: () => {},
      // TODO перенести на более высокий уровень абстракции
      columnControlStorageName: 'ets-storage',
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      filterModalIsOpen: false,
      columnControlModalIsOpen: false,
      filterValues: {},
      columnControlValues: [],
      globalCheckboxState: false,
      isHierarchical: props.isHierarchical,
      initialSort: 'id',
      initialSortAscending: true,
    };
  }

  componentWillMount() {
    // Здесь производится инициализация начальной сортировки для того,
    // чтобы гриддл мог корректно отобразить хедер при первом рендеринге
    // важно устанавливать сортировку именно в willMount!
    const { initialSort = 'id', initialSortAscending = true } = this.props;

    this.setState({ initialSort, initialSortAscending });
  }

  componentDidMount() {
    const { filterValues, columnControl } = this.props;
    if (filterValues) {
      this.setState({ filterValues: this.props.filterValues });
    }
    if (columnControl) {
      const columnControlValues = JSON.parse(localStorage.getItem(this.props.columnControlStorageName)) || [];
      this.setState({ columnControlValues });
    }
  }

  componentWillReceiveProps(props) {
    if (props.checked) {
      // хак, т.к. гридл не умеет в обновление хедера
      // TODO переделать
      const checked = Object.keys(props.checked).length === _(props.results).filter(r => this.shouldBeRendered(r)).value().length;
      const el = document.getElementById('checkedColumn');
      if (el) el.checked = checked;
    }

    let { initialSort, initialSortAscending } = this.state;

    if (props.initialSort && props.initialSort !== this.state.initialSort) {
      initialSort = props.initialSort;
    }

    if (props.initialSortAscending && props.initialSortAscending !== this.state.initialSortAscending) {
      initialSortAscending = props.initialSortAscending;
    }
    if (props.externalFilter) {
      this.setState({ initialSort, initialSortAscending, filterValues: props.filterValues });
    } else {
      this.setState({ initialSort, initialSortAscending });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!this.state.isHierarchical) return true;

    return !_.isEqual(nextProps.results, this.props.results);
  }

  closeFilter() {
    if (this.state.filterModalIsOpen === true) {
      this.setState({ filterModalIsOpen: false });
    }
  }

  toggleFilter() {
    this.setState({ filterModalIsOpen: !this.state.filterModalIsOpen });
  }

  toggleColumnControl() {
    this.setState({ columnControlModalIsOpen: !this.state.columnControlModalIsOpen });
  }

  saveFilter(filterValues) {
    console.log('SAVE FILTER', filterValues);
    if (this.props.externalFilter) {
      this.props.externalFilter(filterValues);
      return;
    }
    if (typeof this.props.onAllRowsChecked === 'function') {
      this.props.onAllRowsChecked(_.reduce(this.props.results, (cur, val) => { cur[val.id] = val; return cur; }, {}), false);
    }
    this.setState({ filterValues, globalCheckboxState: false });
  }

  closeColumnControl() {
    if (this.state.columnControlModalIsOpen === true) {
      this.setState({ columnControlModalIsOpen: false });
    }
  }

  saveColumnControl(column) {
    const { columnControlValues } = this.state;
    const i = columnControlValues.indexOf(column);
    if (i === -1) {
      columnControlValues.push(column);
    } else {
      columnControlValues.splice(i, 1);
    }
    this.setState({ columnControlValues });
    localStorage.setItem(this.props.columnControlStorageName, JSON.stringify(columnControlValues));
  }

  cloneObject(object) {
    const clonedObject = {};
    for (const key of Object.keys(object)) {
      clonedObject[key] = object[key];
    }
    return clonedObject;
  }

  handleRowCheck(id, e) {
    e.preventDefault();
    e.stopPropagation();
    const value = !this.props.checked[id];
    const clonedData = _.cloneDeep(this.props.checked);
    clonedData[id] = value;
    if (value === false) delete clonedData[id];
    this.props.onRowChecked(id, value);
    this.setState({
      globalCheckboxState: Object.keys(clonedData).length === _(this.props.results).filter(r => this.shouldBeRendered(r)).value().length,
    });
  }

  globalCheckHandler(event) {
    const checked = _(this.props.results)
      .filter(r => this.shouldBeRendered(r))
      .reduce((cur, val) => { cur[val.id] = val; return cur; }, {});
    this.props.onAllRowsChecked(checked, !this.state.globalCheckboxState);
    this.setState({ globalCheckboxState: !this.state.globalCheckboxState }, () => {
      this.forceUpdate();
    });
    event && event.stopPropagation();
  }

  initializeMetadata(tableMetaCols = [], renderers = {}) {
    const { multiSelection, enumerated } = this.props;
    const initialArray = [];

    if (multiSelection) {
      initialArray.push({
        columnName: 'isChecked',
        displayName: <input id="checkedColumn" type="checkbox" onChange={this.globalCheckHandler} />,
        sortable: false,
        cssClassName: 'width25 pointer text-center',
        customComponent: (props) => {
          const id = props.rowData.id;
          return <div><input type="checkbox" checked={this.props.checked[id]} onChange={this.handleRowCheck.bind(this, id)} /></div>;
        },
      });
    }

    if (enumerated && !this.state.isHierarchical) {
      initialArray.push({
        columnName: 'rowNumber',
        displayName: '№',
        cssClassName: 'width30',
        filter: false,
        customComponent: renderers.rowNumber,
      });
    }

    const metadata = _.reduce(tableMetaCols, (cur, col) => {
      if (col.display === false) {
        return cur;
      }

      const metaObject = {
        columnName: col.name,
        displayName: col.customHeaderComponent ? col.customHeaderComponent : col.displayName,
      };

      if (typeof renderers[col.name] === 'function') {
        metaObject.customComponent = renderers[col.name];
      }

      if (typeof col.cssClassName !== 'undefined') {
        metaObject.cssClassName = col.cssClassName || '';
      }

      cur.push(metaObject);
      return cur;
    }, initialArray);

    return metadata;
  }

  initializeRowMetadata() {
    return {
      'bodyCssClassName': (rowData) => {
        if (rowData.isSelected) {
          return 'selected-row';
        }
        if (rowData.isHighlighted) {
          return 'highlighted-row';
        }
        return 'standard-row';
      },
    };
  }

  getTypeByKey(key) {
    const col = _.find(this.props.tableMeta.cols, c => c.name === key);
    const colFilterType = col.filter && col.filter.type ? col.filter.type : '';
    return colFilterType;
  }

  shouldBeRendered(obj) {
    if (this.props.externalFilter) return true;
    const { filterValues } = this.state;
    // Здесь проводится проверка на то, фильтруется ли объект
    // если в результате isValid === false, то объект не рендерится в таблице
    // проверка берется по this.state.filterValues
    let isValid = true;
    _.mapKeys(filterValues, (value, key) => {
      if (obj[key] === null) {
        isValid = false;
        return;
      }

      if (/(timestamp|date|birthday)/.test(key) && !_.isArray(value)) {
        if (moment(obj[key]).format(global.APP_DATE_FORMAT) !== moment(value).format(global.APP_DATE_FORMAT)) {
          isValid = false;
        }
      } else if (key.indexOf('date') > -1 && _.isArray(value) && this.getTypeByKey(key) !== 'date_interval') {
        if (value.indexOf(moment(obj[key]).format(global.APP_DATE_FORMAT)) === -1) {
          isValid = false;
        }
      } else if (key.indexOf('date') > -1 && _.isArray(value) && this.getTypeByKey(key) === 'date_interval') {
        const intervalPickerDate1 = moment(value[0]).toDate().getTime() || 0;
        const intervalPickerDate2 = moment(value[1]).toDate().getTime() || Infinity;
        const valueDate = moment(obj[key]).toDate().getTime();
        if (!(intervalPickerDate1 < valueDate && valueDate < intervalPickerDate2)) {
          isValid = false;
        }
      } else if (_.isArray(value)) {
        if (_.isArray(obj[key])) {
          const a = _.find(this.props.tableMeta.cols, e => e.name === key);
          if (a.filter.strict) {
            if (!(_.every(obj[key], el => el.id && value.indexOf(el.id.toString()) > -1) && obj[key].length === value.length)) {
              isValid = false;
            }
          } else if (!(_.find(obj[key], el => el.id && value.indexOf(el.id.toString()) > -1))) {
            isValid = false;
          }
        } else if (typeof obj[key] === 'boolean') {
          if (value.map(v => typeof v === 'string' ? v === 'true' || v === '1' : !!parseInt(v, 10)).indexOf(obj[key]) === -1) {
            isValid = false;
          }
        } else if (value.indexOf(obj[key].toString()) === -1) {
          isValid = false;
        }
      } else if (obj[key] != value) {
        isValid = false;
      }
    });

    return isValid;
  }

  processSelected(selected, selectField, onRowSelected, el) {
    el.isChecked = this.props.checked && this.props.checked[el.id] && this.shouldBeRendered(el);
    if (!selected || typeof onRowSelected === 'undefined') {
      el.isSelected = false;
      return el;
    }
    if (typeof selectField !== 'undefined') {
      el.isSelected = el[selectField] === selected[selectField];
    }
    return el;
  }

  processHighlighted(highlight, el) {
    el.isHighlighted = false;
    if (highlight.length > 0) {
      highlight.forEach((obj) => {
        const field = Object.keys(obj)[0];
        if (el[field] === obj[field]) el.isHighlighted = true;
      });
    }
    return el;
  }

  processEmptyCols(tableCols, el) {
    _.each(tableCols, (col) => {
      if (typeof el[col] === 'undefined') {
        el[col] = null;
      }
    });
    return el;
  }

  processTableData(data, tableCols, selected, selectField, onRowSelected, highlight = []) {
    return _(data)
           .map(this.processEmptyCols.bind(this, tableCols))
           .map(this.processHighlighted.bind(this, highlight))
           .map(this.processSelected.bind(this, selected, selectField, onRowSelected))
           .filter(this.shouldBeRendered)
           .value();
  }

  handleChangeSort(sortingColumnName, ascendingSort) {
    this.setState({
      initialSort: sortingColumnName,
      initialSortAscending: ascendingSort,
    });
  }

  handleKeyPress(data, keyCode, e) {
    if (isEmpty(this.props.selected)) {
      return;
    }
    let direction = 0;

    if (keyCode === 40) {
      direction = +1;
      e.preventDefault();
    }
    if (keyCode === 38) {
      direction = -1;
      e.preventDefault();
    }
    const selected = _.find(data, el => el[this.props.selectField] === this.props.selected[this.props.selectField]);
    const newSelected = _.find(data, el => el.rowNumber === selected.rowNumber + direction);

    this.props.onRowSelected({
      props: {
        data: newSelected,
        fromKey: true,
      },
    });
  }

  render() {
    const { tableMeta, renderers, onRowSelected, selected,
      selectField, title, noTitle, noFilter,
      enableSort, noDataMessage, className, noHeader,
      refreshable, columnControl, highlight, serverPagination, externalChangeSort } = this.props;
    const { initialSort, initialSortAscending, columnControlValues, isHierarchical } = this.state;

    const tableMetaCols = _.cloneDeep(tableMeta.cols);
    let data = _.cloneDeep(this.props.results);

    if (typeof this.props.results === 'string') {
      data = [];
    }

    const columnMetadata = this.initializeMetadata(tableMetaCols, renderers);
    const tableCols = columnMetadata.map(m => m.columnName).filter(c => columnControlValues.indexOf(c) === -1);
    const rowMetadata = this.initializeRowMetadata();
    const tableClassName = cx('data-table', className);

    const results = this.processTableData(data, tableCols, selected, selectField, onRowSelected, highlight);

    return (
      <Div className={tableClassName}>
        <Div className="some-header" hidden={noHeader}>{noTitle ? '' : title}
          <div className="waybills-buttons">
            {columnControl &&
              <ClickOutHandler onClickOut={this.closeColumnControl}>
                <ColumnControl
                  show={this.state.columnControlModalIsOpen}
                  onChange={this.saveColumnControl}
                  onClick={this.toggleColumnControl}
                  values={this.state.columnControlValues}
                  options={tableMetaCols.filter(el => el.display !== false)}
                />
              </ClickOutHandler>
            }
            {!noFilter && <FilterButton
              show={this.state.filterModalIsOpen}
              active={!!_.keys(this.state.filterValues).length}
              onClick={this.toggleFilter}
                          />}
            {refreshable &&
              <Button
                bsSize="small"
                onClick={this.props.onRefresh}
              >
                <Glyphicon glyph="refresh" />
              </Button>
            }
            {this.props.children}
          </div>
          {!noFilter && <Filter
            show={this.state.filterModalIsOpen}
            onSubmit={this.saveFilter}
            onHide={this.closeFilter}
            values={this.state.filterValues}
            options={tableMetaCols.filter(el => el.filter !== false)}
            tableData={this.props.results}
                        />}
        </Div>
        <Griddle
          results={results}
          enableSort={enableSort}
          initialSort={initialSort}
          initialSortAscending={initialSortAscending}
          columnMetadata={columnMetadata}
          columns={tableCols}
          resultsPerPage={15}
          useCustomPagerComponent
          externalChangeSort={externalChangeSort || this.handleChangeSort}
          customPagerComponent={serverPagination ? <Div /> : Paginator}
          onRowClick={!isHierarchical ? onRowSelected : null}
          rowMetadata={rowMetadata}
          onKeyPress={this.handleKeyPress}
          noDataMessage={noDataMessage || noFilter ? '' : 'Нет данных'}
        />
      </Div>
    );
  }
}
