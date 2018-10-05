import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import cx from 'classnames';

import ClickOutHandler from 'react-onclickout';
import { autobind } from 'core-decorators';
import { diffDates } from 'utils/dates';
import { isEmpty } from 'utils/functions';
import SimpleGriddle from 'components/ui/table/simple-griddle/SimpleGriddle';

import {
  isStringArrayData,
  isNumberSelectArrayData,
  stringArrayDataMatching,
  numberArrayDataMatching,
  parseAdvancedFilter,
  getFilterTypeByKey,
  makeData,
} from './utils';
import ColumnControl from './ColumnControl.jsx';
import Filter from './filter/Filter.jsx';
import FilterButton from './filter/FilterButton.jsx';
import Div from '../Div.jsx';
import PaginatorToPortalData from 'components/ui/new/paginator/PaginatorToPortalData';
import Paginator from 'components/ui/new/paginator/Paginator';

const style = {
  headRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    flex: '1 0 auto',
  },
};

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

      firstUseExternalInitialSort: PropTypes.bool,
      initialSort: PropTypes.string,
      initialSortAscending: PropTypes.bool,

      children: PropTypes.node,

      enumerated: PropTypes.bool,
      refreshable: PropTypes.bool,
      multiSelection: PropTypes.bool,
      serverPagination: PropTypes.bool,
      lowerCaseSorting: PropTypes.bool,
      noDataMessage: PropTypes.string,

      noFilter: PropTypes.bool,
      noTitle: PropTypes.bool,
      noHeader: PropTypes.bool,
      enableSort: PropTypes.bool,

      title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
      ]),
      rowNumberLabel: PropTypes.string,

      tableMeta: PropTypes.object,
      filterValues: PropTypes.object,
      filterResetting: PropTypes.bool,
      externalFilter: PropTypes.func,
      highlightClassMapper: PropTypes.func,
      highlightClassColMapper: PropTypes.func,
      highlight: PropTypes.array,

      columnControl: PropTypes.bool,
      // TODO реализовать обработку вне
      onColumnControlChange: PropTypes.func,
      // TODO перенести на более высокий уровень абстракции
      columnControlStorageName: PropTypes.string,
      normInitialData: PropTypes.bool,
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

      firstUseExternalInitialSort: true,
      initialSort: '',
      initialSortAscending: false,

      enableSort: true,

      enumerated: true,
      refreshable: false,
      multiSelection: false,
      serverPagination: false,
      lowerCaseSorting: false,
      noDataMessage: 'Нет данных',

      noFilter: false,
      filterResetting: false,
      noHeader: false,
      noTitle: false,

      tableMeta: {},

      columnControl: false,
      // TODO реализовать обработку вне
      onColumnControlChange: () => {},
      // TODO перенести на более высокий уровень абстракции
      columnControlStorageName: 'ets-storage',
      normInitialData: false,
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
      firstUseExternalInitialSort: true,
      initialSort: this.props.initialSort,
      initialSortAscending: this.props.initialSortAscending,
      data: [],
      originalData: [],
      uniqKey: Symbol(props.uniqKey || 'data-table'),
    };

    // временно до выпиливания гридла
    if (props.normInitialData) {
      const {
        initialSort,
        initialSortAscending,
        firstUseExternalInitialSort,
      } = this.state;

      const changesFields = {
        initialSort,
        initialSortAscending,
        firstUseExternalInitialSort,
        originalData: this.state.originalData,
        data: this.state.data,
      };

      if (firstUseExternalInitialSort && props.initialSort && props.initialSort !== initialSort) {
        changesFields.initialSort = props.initialSort;
        changesFields.firstUseExternalInitialSort = false;
      }

      if (firstUseExternalInitialSort && props.initialSortAscending && props.initialSortAscending !== initialSortAscending) {
        changesFields.initialSortAscending = props.initialSortAscending;
      }
      if (props.useServerFilter) {
        changesFields.filterValues = props.filterValues;
      }
      if (props.filterResetting) {
        changesFields.filterValues = {};
      }

      if (Array.isArray(props.results)) {
        changesFields.originalData = props.results;
        changesFields.data = props.results;
      }

      if (!props.useServerSort || !props.useServerFilter) {
        changesFields.data = makeData(changesFields.data, this.state, { ...props, ...changesFields });
      }
      this.state = {
        ...this.state,
        ...changesFields,
      };
    }
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
    const {
      initialSort,
      firstUseExternalInitialSort,
      initialSortAscending,
    } = this.state;

    const changesFields = {
      initialSort,
      initialSortAscending,
      firstUseExternalInitialSort,
      originalData: this.state.originalData,
      data: this.state.data,
    };

    if (firstUseExternalInitialSort) {
      if (props.initialSort && props.initialSort !== initialSort) {
        changesFields.initialSort = props.initialSort;
      }
      if (props.initialSortAscending && props.initialSortAscending !== initialSortAscending) {
        changesFields.initialSortAscending = props.initialSortAscending;
      }
      changesFields.firstUseExternalInitialSort = false;
    }

    // очень странные дела
    if (changesFields.firstUseExternalInitialSort) {
      changesFields.firstUseExternalInitialSort = false;
    }

    if (props.useServerFilter) {
      changesFields.filterValues = props.filterValues;
    }
    if (props.filterResetting) {
      changesFields.filterValues = {};
    }

    if (Array.isArray(props.results) && props.results !== this.state.originalData) {
      changesFields.originalData = props.results;
      changesFields.data = props.results;
    }

    if (!props.useServerSort || !props.useServerFilter) {
      changesFields.data = makeData(changesFields.originalData, this.state, { ...props, ...changesFields });
    }

    this.setState(changesFields);
  }

  shouldComponentUpdate(nextProps) {
    if (!this.state.isHierarchical) return true;

    return !_.isEqual(nextProps.results, this.props.results);
  }

  getFilterTypeByKey(key) {
    return getFilterTypeByKey(key, this.props.tableMeta);
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
    console.log('SAVE FILTER', filterValues); // eslint-disable-line

    if (this.props.externalFilter) {
      this.props.externalFilter(filterValues);
      return;
    }
    if (typeof this.props.onAllRowsChecked === 'function') {
      this.props.onAllRowsChecked(this.props.results.reduce((cur, val) => { cur[val.id] = val; return cur; }, {}), false);
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

  handleRowCheck = (id) => {
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
  defaultIinitializeMetadata(tableMetaCols = [], renderers = {}) {
    return tableMetaCols.reduce((cur, col) => {
      if (col.display === false) {
        return cur;
      }

      const metaObject = {
        columnName: col.name,
        displayName: col.customHeaderComponent ? col.customHeaderComponent : col.displayName,
        sortable: (typeof col.sortable === 'boolean') ? col.sortable : true,
      };
      if (col.type === 'string') {
        const callbackF = (typeof renderers[col.name] === 'function' && renderers[col.name]) || false;
        if (!col.fullString) {
          metaObject.customComponent = props => this.cutString(callbackF, props);
        }
      } else if (typeof renderers[col.name] === 'function') {
        metaObject.customComponent = renderers[col.name];
      }

      if (typeof col.cssClassName !== 'undefined') {
        metaObject.cssClassName = col.cssClassName || '';
      }

      cur.push(metaObject);
      return cur;
    }, []);
  }
  initializeMetadata(tableMetaCols = [], renderers = {}) {
    const { multiSelection, enumerated, rowNumberLabel = '№', rowNumberClassName = 'width30' } = this.props;
    const initialArray = [];

    if (multiSelection) {
      initialArray.push({
        columnName: 'isChecked',
        displayName: <input id="checkedColumn" type="checkbox" onChange={this.globalCheckHandler} />,
        sortable: false,
        cssClassName: 'width25 pointer text-center',
      });
    }

    if (enumerated && !this.state.isHierarchical) {
      initialArray.push({
        columnName: 'rowNumber',
        displayName: rowNumberLabel,
        cssClassName: rowNumberClassName,
        filter: false,
        sortable: false,
        customComponent: renderers.rowNumber,
      });
    }
    initialArray.push(...this.defaultIinitializeMetadata(tableMetaCols, renderers));

    return initialArray;
  }
  cutString = (callback, props) => {
    const newProps = { ...props };
    let { data = '' } = props;

    if (typeof data === 'string' && data.split(' ').some(d => d.length > 30)) {
      data = `${data.slice(0, 20)}...`;
    }

    newProps.data = data;

    if (callback) {
      return callback(newProps);
    }
    return (<div>{data}</div>);
  }

  initializeRowMetadata() {
    const defaultClass = 'standard-row';

    return {
      'bodyCssClassName': (rowData) => {
        if (rowData.isSelected) {
          return 'selected-row';
        }
        if (typeof this.props.highlightClassMapper === 'function') {
          return this.props.highlightClassMapper(rowData) || defaultClass;
        }
        if (rowData.isHighlighted) {
          return 'highlighted-row';
        }

        return defaultClass;
      },
      'tdCssClassName': (col) => {
        // [field_name, field_value];
        if (typeof this.props.highlightClassColMapper === 'function') {
          return this.props.highlightClassColMapper(col);
        }

        return undefined;
      },
    };
  }

  shouldBeRendered(obj) {
    if (this.props.externalFilter && !this.props.needMyFilter) {
      return true;
    }

    const { filterValues } = this.state;
    // Здесь проводится проверка на то, фильтруется ли объект
    // если в результате isValid === false, то объект не рендерится в таблице
    // проверка берется по this.state.filterValues
    let isValid = true;
    const {
      tableMeta: {
        cols = [],
      },
    } = this.props;

    Object.entries(filterValues).forEach(([key, { value }]) => {
      if (key.includes('additionalFilter')) {
        try {
          const { filter: { filterFunction } } = cols.find(d => d.name === key);
          isValid = filterFunction(value, obj);
        } catch (e) {
          console.warn(`Ошибка при поиске кастомной функции фильтрации ${key}`, e);
        }
      } else {
        if (obj[key] === null && !key.includes('additionalFilter') || !isValid) {
          isValid = false;
          return;
        }

        const IS_ARRAY = Array.isArray(value);
    
        if (/(timestamp|date|birthday)/.test(key) && !IS_ARRAY) {
          const { filter } = cols.find(({ name }) => name === key);
          if (filter && filter.type === 'datetime' && diffDates(obj[key], value) !== 0) {
            isValid = false;
          } else if (moment(obj[key]).format(global.APP_DATE_FORMAT) !== moment(value).format(global.APP_DATE_FORMAT)) {
            isValid = false;
          }
        } else if (key.indexOf('date') > -1 && IS_ARRAY && this.getFilterTypeByKey(key) !== 'date_interval') {
          if (value.indexOf(moment(obj[key]).format(global.APP_DATE_FORMAT)) === -1) {
            isValid = false;
          }
        } else if (key.indexOf('date') > -1 && IS_ARRAY && this.getFilterTypeByKey(key) === 'date_interval') {
          const intervalPickerDate1 = moment(value[0]).toDate().getTime() || 0;
          const intervalPickerDate2 = moment(value[1]).toDate().getTime() || Infinity;
          const valueDate = moment(obj[key]).toDate().getTime();
          if (!(intervalPickerDate1 < valueDate && valueDate < intervalPickerDate2)) {
            isValid = false;
          }
        } else if (IS_ARRAY) {
          const a = this.props.tableMeta.cols.find(e => e.name === key);
          if (Array.isArray(obj[key])) {
            if (a.filter.strict) {
              if (!(obj[key].every(el => el.id && value.indexOf(el.id.toString()) > -1) && obj[key].length === value.length)) {
                isValid = false;
              }
            } else if (a.filter.some) {
              if (!obj[key].some(el => value.every(val => el.toString().includes(val)))) {
                isValid = false;
              }
            } else if (!(obj[key].find(el => (el.id && value.indexOf(el.id.toString()) > -1) || (el && value.indexOf(el) > -1)))) {
              isValid = false;
            }
          } else if (typeof obj[key] === 'boolean') {
            if (value.map(v => typeof v === 'string' ? v === 'true' || v === '1' : !!parseInt(v, 10)).indexOf(obj[key]) === -1) {
              isValid = false;
            }
          } else if (a && a.filter && a.filter.some) {
            if (value.findIndex(d => obj[key].toString().toLowerCase().includes(d.toLowerCase()))) {
              isValid = false;
            }
          } else if (value.findIndex((d) => {
            if (isNaN(Number(d))) {
              return (d || '').toLowerCase() === obj[key].toString().toLowerCase();
            }
            return Number(d) === Number(obj[key]);
          }) === -1) {
            isValid = false;
          }
          /**
           * Фильтр: строка
           * Значение: массив строк
           */
        } else if (isStringArrayData(value, obj[key], key, this.props.tableMeta)) {
          isValid = isValid && stringArrayDataMatching(value, obj[key]);
          /**
           * Фильтр: селект лист из чисел
           * Значение: массив чисел
           */
        } else if (isNumberSelectArrayData(value, obj[key], key, this.props.tableMeta)) {
          isValid = isValid && numberArrayDataMatching(value, obj[key]);
        } else if (_.isPlainObject(value) && Object.keys(value).length > 0) {
          const metaCol = this.props.tableMeta.cols.find(item => item.name === key);
          const filterType = _.get(metaCol, 'filter.type', '');
          isValid = isValid && parseAdvancedFilter(value, key, obj[key], filterType);
        } else if (typeof obj[key] === 'string') {
          isValid = isValid && stringArrayDataMatching(value, [obj[key]]);
        } else if (obj[key] !== value) {
          isValid = false;
        }
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
    tableCols.forEach((col) => {
      if (typeof el[col] === 'undefined') {
        el[col] = null;
      }
    });
    return el;
  }

  processTableData(data, tableCols, selected, selectField, onRowSelected, highlight = []) {
    return data
          .map(this.processEmptyCols.bind(this, tableCols))
          .map(this.processHighlighted.bind(this, highlight))
          .map(this.processSelected.bind(this, selected, selectField, onRowSelected))
          .filter(this.shouldBeRendered);
  }

  handleChangeSort(sortingColumnName, ascendingSort) {
    const nextProps = {
      initialSort: sortingColumnName,
      initialSortAscending: ascendingSort,
    };
    const prevState = {
      ...this.state,
      initialSort: this.state.initialSort,
      initialSortAscending: this.state.initialSortAscending,
    };
    if (this.state.firstUseExternalInitialSort) {
      nextProps.firstUseExternalInitialSort = false;
    }

    this.setState({
      ...nextProps,
      data: makeData(this.state.originalData, prevState, { ...this.props, ...nextProps }),
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
    const selected = data.find(el => el[this.props.selectField] === this.props.selected[this.props.selectField]);
    const newSelected = data.find(el => el.rowNumber === selected.rowNumber + direction);

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
      noCustomButton = false,
      refreshable, columnControl, highlight, serverPagination, externalChangeSort,
      griddleHidden = false,
      haveMax = true,
    } = this.props;
    const { initialSort, initialSortAscending, columnControlValues, isHierarchical } = this.state;

    const tableMetaCols = (tableMeta.cols);
    const { data } = this.state;

    const columnMetadata = this.initializeMetadata(tableMetaCols, renderers);
    const tableCols = columnMetadata.map(m => m.columnName).filter(c => columnControlValues.indexOf(c) === -1);
    const rowMetadata = this.initializeRowMetadata();
    const tableClassName = cx('data-table', className);

    const results = this.processTableData(data, tableCols, selected, selectField, onRowSelected, highlight);

    return (
      <Div className={tableClassName}>
        <Div className="some-header" hidden={noHeader}>
          <div style={{ display: 'flex', 'justifyContent': 'space-between' }}>
            <div>
              {noTitle ? '' : title}
            </div>
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
              {!noFilter &&
                <FilterButton
                  show={this.state.filterModalIsOpen}
                  active={!!Object.keys(this.state.filterValues).length}
                  onClick={this.toggleFilter}
                />
              }
              {refreshable &&
                <Button
                  bsSize="small"
                  onClick={this.props.onRefresh}
                >
                  <Glyphicon glyph="refresh" />
                </Button>
              }
              {!noCustomButton && this.props.children}
            </div>
          </div>
          {!noFilter &&
            <Filter
              show={this.state.filterModalIsOpen}
              onSubmit={this.saveFilter}
              onHide={this.closeFilter}
              values={this.state.filterValues}
              options={tableMetaCols.filter(el => el.filter !== false)}
              tableData={this.props.results}
            />
          }
        </Div>
        {/* lowerCaseSorting - сортировка в этом компоненте, а не в griddle.getDataForRender */}
        <SimpleGriddle
          uniqKey={this.state.uniqKey}
          selectField={this.props.selectField}
          results={results}
          enableSort={enableSort}
          initialSort={initialSort}
          initialSortAscending={initialSortAscending}
          columnMetadata={columnMetadata}
          columns={tableCols}
          resultsPerPage={15}
          useCustomPagerComponent
          externalChangeSort={externalChangeSort || this.handleChangeSort}
          customPagerComponent={serverPagination ? false : PaginatorToPortalData}
          onRowClick={!isHierarchical ? onRowSelected : null}
          onRowDoubleClick={this.props.onRowDoubleClick}
          onRowClickNew={this.props.onRowClick}
          rowMetadata={rowMetadata}
          onKeyPress={this.handleKeyPress}
          noDataMessage={noDataMessage || noFilter ? '' : 'Нет данных'}
          rowNumberOffset={serverPagination ? this.props.rowNumberOffset : 0}
          handleRowCheck={this.handleRowCheck}
          serverPagination={serverPagination}
        />
        {
          serverPagination ?
          (
            <div></div>
          )
          :
          (
            <Paginator uniqKey={this.state.uniqKey} />
          )
        }
      </Div>
    );
  }
}
