import * as React from 'react';
import * as PropTypes from 'prop-types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as moment from 'moment';
import { isPlainObject, cloneDeep } from 'lodash';
import cx from 'classnames';

import { diffDates } from 'components/@next/@utils/dates/dates';
import { isEmpty } from 'utils/functions';
import SimpleGriddle from 'components/old/ui/table/simple-griddle/SimpleGriddle';

import {
  isStringArrayData,
  isNumberSelectArrayData,
  stringArrayDataMatching,
  numberArrayDataMatching,
  parseAdvancedFilter,
  getFilterTypeByKey,
  makeData,
} from 'components/old/ui/table/utils';
import Filter from 'components/old/ui/table/filter/Filter';
import FilterButton from 'components/old/ui/table/filter/FilterButton';
import Div from 'components/old/ui/Div';
import Paginator from 'components/old/ui/new/paginator/Paginator';
import { DataTableHeadLineTitle, DataTableHeadLine } from './styled';
import { setStickyThead } from 'utils/stickyTableHeader';
import { isArray, isNullOrUndefined } from 'util';
import { renderCarData } from 'components/old/ui/table/legacy';
import { isNumber } from 'highcharts';

type Props = {
  [k: string]: any;
  localState?: {
    show_gov_numbers?: boolean;
  };
};
type State = {
  [k: string]: any;
};

export default class DataTable extends React.Component<Props, State> {
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

      title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      rowNumberLabel: PropTypes.string,

      tableMeta: PropTypes.object,
      filterValues: PropTypes.object,
      externalFilter: PropTypes.func,
      highlightClassMapper: PropTypes.func,
      highlightClassColMapper: PropTypes.func,
      highlight: PropTypes.array,

      normInitialData: PropTypes.bool,
      currentPage: PropTypes.any,
      perPageLocal: PropTypes.number,
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

      onAllRowsChecked: () => {
        //
      },
      onRowChecked: () => {
        //
      },
      onRowSelected: () => {
        //
      },
      onRefresh: () => {
        //
      },

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
      noHeader: false,
      noTitle: false,

      tableMeta: {},

      normInitialData: false,
      currentPage: 0,
      perPageLocal: 15,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      filterModalIsOpen: false,
      filterValues: {},
      globalCheckboxState: false,
      isHierarchical: props.isHierarchical,
      firstUseExternalInitialSort: true,
      initialSort: this.props.initialSort,
      initialSortAscending: this.props.initialSortAscending,
      data: [],
      originalData: this.props.data,
      currentPage: props.page || 0,
      perPageLocal: 15,
    };

    // временно до выпиливания гридла
    if (props.normInitialData) {
      const {
        initialSort,
        initialSortAscending,
        firstUseExternalInitialSort,
      } = this.state;

      const changesFields: any = {
        initialSort,
        initialSortAscending,
        firstUseExternalInitialSort,
        originalData: this.state.originalData,
        data: this.state.data,
      };

      if (
        firstUseExternalInitialSort
        && props.initialSort
        && props.initialSort !== initialSort
      ) {
        changesFields.initialSort = props.initialSort;
        changesFields.firstUseExternalInitialSort = false;
      }

      if (
        firstUseExternalInitialSort
        && props.initialSortAscending
        && props.initialSortAscending !== initialSortAscending
      ) {
        changesFields.initialSortAscending = props.initialSortAscending;
      }
      if (props.useServerFilter) {
        changesFields.filterValues = props.filterValues;
      }

      if (Array.isArray(props.results)) {
        changesFields.originalData = props.results;
        changesFields.data = props.results;
      }

      if (!props.useServerSort || !props.useServerFilter) {
        changesFields.data = makeData(changesFields.originalData, this.state, {
          ...props,
          ...changesFields,
        });
      }
      this.state = {
        ...this.state,
        ...changesFields,
      };
    }
  }

  componentDidMount() {
    const { filterValues } = this.props;
    if (filterValues) {
      this.setState({ filterValues: this.props.filterValues });
    }
    setStickyThead('.data-table .griddle', true);
  }

  componentWillUnmount() {
    setStickyThead('.data-table .griddle', false);
  }

  static getDerivedStateFromProps(nextProps, preveState) {
    const {
      initialSort,
      firstUseExternalInitialSort,
      initialSortAscending,
      originalData,
      data,
    } = preveState;

    const changesFields: any = {
      initialSort,
      initialSortAscending,
      firstUseExternalInitialSort,
      originalData,
      data,
    };

    if (firstUseExternalInitialSort) {
      if (nextProps.initialSort && nextProps.initialSort !== initialSort) {
        changesFields.initialSort = nextProps.initialSort;
      }
      if (
        nextProps.initialSortAscending
        && nextProps.initialSortAscending !== initialSortAscending
      ) {
        changesFields.initialSortAscending = nextProps.initialSortAscending;
      }
      changesFields.firstUseExternalInitialSort = false;
    }

    // очень странные дела
    if (changesFields.firstUseExternalInitialSort) {
      changesFields.firstUseExternalInitialSort = false;
    }

    if (nextProps.useServerFilter) {
      changesFields.filterValues = nextProps.filterValues;
    }

    if (
      Array.isArray(nextProps.results)
      && nextProps.results !== originalData
    ) {
      changesFields.originalData = nextProps.results;
      changesFields.data = nextProps.results;
    }

    if (!nextProps.useServerSort || !nextProps.useServerFilter) {
      changesFields.data = makeData(changesFields.originalData, preveState, {
        ...nextProps,
        ...changesFields,
      });
    }

    return changesFields;
  }

  getFilterTypeByKey(key) {
    return getFilterTypeByKey(key, this.props.tableMeta);
  }

  closeFilter = () => {
    if (this.state.filterModalIsOpen === true) {
      this.setState({ filterModalIsOpen: false });
    }
  };

  toggleFilter = () => {
    this.setState({ filterModalIsOpen: !this.state.filterModalIsOpen });
  };

  saveFilter = (filterValues) => {
    if (__DEVELOPMENT__) {
      console.info('SAVE FILTER_', filterValues);  // eslint-disable-line
    } else {
      let filterAsString = '';

      try {
        filterAsString = JSON.stringify(filterValues);
      } catch (e) {
        filterAsString = filterValues;
      }

      console.info('SAVE FILTER__', filterAsString);  // eslint-disable-line
    }

    if (this.props.externalFilter) {
      this.props.externalFilter(filterValues);
      return;
    }
    if (typeof this.props.onAllRowsChecked === 'function') {
      this.props.onAllRowsChecked(
        this.props.results.reduce((cur, val) => {
          cur[val.id] = val;
          return cur;
        }, {}),
        false,
      );
    }
    this.setState({ filterValues, globalCheckboxState: false });
  };

  handleRowCheck = (id) => {
    const value = !this.props.checked[id];
    const clonedData = cloneDeep(this.props.checked);
    clonedData[id] = value;
    if (value === false) {
      delete clonedData[id]; 
    }
    this.props.onRowChecked(id, value);
    this.setState({
      globalCheckboxState: Object.keys(clonedData).length === this.props.results.filter((r) => this.shouldBeRendered(r)).length,
    });
  };

  globalCheckHandler = (shortResult, event) => {
    const checked = shortResult.reduce((cur, val) => {
      cur[val[this.props.selectField]] = val;
      return cur;
    }, {});

    this.props.onAllRowsChecked(checked, !this.state.globalCheckboxState);
    this.setState(
      { globalCheckboxState: !this.state.globalCheckboxState },
      () => {
        this.forceUpdate();
      },
    );
    if (event) {
      event.stopPropagation();
    }
  };

  defaultIinitializeMetadata(tableMetaCols = [], renderers = {}) {
    return tableMetaCols.reduce((cur, col) => {
      if (col.display === false) {
        return cur;
      }

      const metaObject: any = {
        columnName: col.name,
        sortByName: col.sort_by || col.name,
        displayName: col.customHeaderComponent
          ? col.customHeaderComponent
          : col.displayName,
        sortable: typeof col.sortable === 'boolean' ? col.sortable : true,
        fieldTitlePopup: col.fieldTitlePopup,
      };
      if (col.make_str_gov_number_format) {
        metaObject.customComponent = (props) => renderCarData(props, this.props);
      } else if (!isNullOrUndefined(col.precision)) {
        metaObject.customComponent = (props) =>
          this.precisionNumberRender(col.precision, props);
      } else if (col.type === 'string') {
        const callbackF
          = (typeof renderers[col.name] === 'function' && renderers[col.name])
          || false;
        if (!col.fullString) {
          metaObject.customComponent = (props) =>
            this.cutString(callbackF, props);
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

  initializeMetadata(tableMetaCols = [], renderers: any = {}) {
    const {
      multiSelection,
      enumerated,
      rowNumberLabel = '№',
      rowNumberClassName = 'width30',
    } = this.props;
    const initialArray = [];

    if (multiSelection) {
      initialArray.push({
        columnName: 'isChecked',
        displayName: '',
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
    initialArray.push(
      ...this.defaultIinitializeMetadata(tableMetaCols, renderers),
    );

    return initialArray;
  }

  cutString(callback, props) {
    const newProps = { ...props };
    let { data = '' } = props;

    if (
      typeof data === 'string'
      && data.split(' ').some((d) => d.length > 30)
    ) {
      data = `${data.slice(0, 50)}...`;
    }

    newProps.data = data;

    if (callback) {
      return callback(newProps);
    }
    return <div>{data}</div>;
  }

  precisionNumberRender(precision, props) {
    let { data = '' } = props;
    return <div>{ isNumber(data)
      ? data?.toFixed(precision)
      : data}</div>;
  }

  initializeRowMetadata() {
    const defaultClass = 'standard-row';
    return {
      bodyCssClassName: (rowData, checkedData) => {
        if (rowData.isSelected) {
          return 'selected-row';
        }
        if (typeof this.props.highlightClassMapper === 'function') {
          return (
            this.props.highlightClassMapper(rowData, checkedData)
            || defaultClass
          );
        }
        if (rowData.isHighlighted) {
          return 'highlighted-row';
        }

        return defaultClass;
      },
      tdCssClassName: (col) => {
        // [field_name, field_value];
        if (typeof this.props.highlightClassColMapper === 'function') {
          return this.props.highlightClassColMapper(col);
        }

        return undefined;
      },
    };
  }

  shouldBeRendered = (obj) => {
    if (this.props.externalFilter && !this.props.needMyFilter) {
      return true;
    }

    const { filterValues } = this.state;
    // Здесь проводится проверка на то, фильтруется ли объект
    // если в результате isValid === false, то объект не рендерится в таблице
    // проверка берется по this.state.filterValues
    let isValid = true;
    const {
      tableMeta: { cols = [] },
    } = this.props;

    Object.entries(filterValues).forEach(([key, { value }]: any) => {
      if (key.includes('additionalFilter')) {
        try {
          const {
            filter: { filterFunction },
          } = cols.find((d) => d.name === key);
          isValid = filterFunction(value, obj);
        } catch (e) {
          console.warn(  // eslint-disable-line
            `Ошибка при поиске кастомной функции фильтрации ${key}`,
            e,
          );
        }
      } else {
        if (
          (obj[key] === null && !key.includes('additionalFilter'))
          || !isValid
        ) {
          isValid = false;
          return;
        }

        const IS_ARRAY = Array.isArray(value);

        if (/(timestamp|date|birthday)/.test(key) && !IS_ARRAY) {
          const { filter } = cols.find(({ name }) => name === key);
          if (
            filter
            && filter.type === 'datetime'
            && diffDates(obj[key], value) !== 0
          ) {
            isValid = false;
          } else if (
            moment(obj[key]).format(global.APP_DATE_FORMAT)
            !== moment(value).format(global.APP_DATE_FORMAT)
          ) {
            isValid = false;
          }
        } else if (
          key.indexOf('date') > -1
          && IS_ARRAY
        ) {
          if (
            value.indexOf(moment(obj[key]).format(global.APP_DATE_FORMAT))
            === -1
          ) {
            isValid = false;
          }
        } else if (IS_ARRAY) {
          const a = this.props.tableMeta.cols.find((e) => e.name === key);
          if (Array.isArray(obj[key])) {
            if (a.filter.strict) {
              if (
                !(
                  obj[key].every(
                    (el) => el.id && value.indexOf(el.id.toString()) > -1,
                  ) && obj[key].length === value.length
                )
              ) {
                isValid = false;
              }
            } else if (a.filter.someInRowValue) {
              if (
                !value.some((val) =>
                  obj[key].some((el) => el.toString().includes(val.toString())),
                )
              ) {
                isValid = false;
              }
            } else if (
              !obj[key].find(
                (el) =>
                  (el.id && value.indexOf(el.id.toString()) > -1)
                  || (el && value.indexOf(el) > -1),
              )
            ) {
              isValid = false;
            }
          } else if (typeof obj[key] === 'boolean') {
            if (
              value
                .map((v) =>
                  typeof v === 'string'
                    ? v === 'true' || v === '1'
                    : !!parseInt(v, 10),
                )
                .indexOf(obj[key]) === -1
            ) {
              isValid = false;
            }
          } else if (a && a.filter && a.filter.someInRowValue) {
            if (
              value.findIndex((d) =>
                obj[key]
                  .toString()
                  .toLowerCase()
                  .includes(d.toLowerCase()),
              )
            ) {
              isValid = false;
            }
          } else if (
            value.findIndex((d) => {
              if (isNaN(Number(d))) {
                return (
                  (d || '').toLowerCase() === obj[key].toString().toLowerCase()
                );
              }
              return Number(d) === Number(obj[key]);
            }) === -1
          ) {
            isValid = false;
          }
          /**
           * Фильтр: строка
           * Значение: массив строк
           */
        } else if (
          isStringArrayData(value, obj[key], key, this.props.tableMeta)
        ) {
          isValid = isValid && stringArrayDataMatching(value, obj[key]);
          /**
           * Фильтр: селект лист из чисел
           * Значение: массив чисел
           */
        } else if (
          isNumberSelectArrayData(value, obj[key], key, this.props.tableMeta)
        ) {
          isValid = isValid && numberArrayDataMatching(value, obj[key]);
        } else if (isPlainObject(value) && Object.keys(value).length > 0) {
          const metaCol = this.props.tableMeta.cols.find(
            (item) => item.name === key,
          );
          const filterType = metaCol?.filter?.type || '';
          isValid
            = isValid && parseAdvancedFilter(value, key, obj[key], filterType);
        } else if (typeof obj[key] === 'string') {
          isValid = isValid && stringArrayDataMatching(value, [obj[key]]);
        } else if (obj[key] !== value) {
          isValid = false;
        }
      }
    });

    return isValid;
  };

  processSelected(selected, selectField, onRowSelected, el) {
    el.isChecked
      = this.props.checked
      && this.props.checked[el[selectField]]
      && this.shouldBeRendered(el);
    if (!selected || typeof onRowSelected === 'undefined') {
      el.isSelected = false;
      return el;
    }
    if (typeof selectField !== 'undefined' && selected[selectField]) {
      el.isSelected = el[selectField] === selected[selectField];
    }
    return el;
  }

  processHighlighted(highlight, el) {
    el.isHighlighted = false;
    if (highlight.length > 0) {
      highlight.forEach((obj) => {
        const field = Object.keys(obj)[0];
        if (el[field] === obj[field]) {
          el.isHighlighted = true; 
        }
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

  processTableData(
    data,
    tableCols,
    selected,
    selectField,
    onRowSelected,
    highlight = [],
  ) {
    const deepArr = data.some(({ rows }) => isArray(rows));

    if (deepArr) {
      return data
        .map((blockData) => ({
          ...blockData,
          rows: blockData.rows
            .map(this.processEmptyCols.bind(this, tableCols))
            .map(this.processHighlighted.bind(this, highlight))
            .map(
              this.processSelected.bind(
                this,
                selected,
                selectField,
                onRowSelected,
              ),
            )
            .filter(this.shouldBeRendered),
        }))
        .filter(({ rows }) => rows.length);
    }
    return data
      .map(this.processEmptyCols.bind(this, tableCols))
      .map(this.processHighlighted.bind(this, highlight))
      .map(
        this.processSelected.bind(this, selected, selectField, onRowSelected),
      )
      .filter(this.shouldBeRendered);
  }

  handleChangeSort = (sortingColumnName, ascendingSort) => {
    const nextProps: any = {
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
      data: makeData(this.state.originalData, prevState, {
        ...this.props,
        ...nextProps,
      }),
    });
  };

  setPage = (currentPage) => {
    this.setState({ currentPage });
  };

  setPerPage = (value) => {
    this.setState({perPageLocal: value});
  };

  handleKeyPress = (data, keyCode, e) => {
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
    const selected = data.find(
      (el) =>
        el[this.props.selectField]
        === this.props.selected[this.props.selectField],
    );
    const newSelected = data.find(
      (el) => el.rowNumber === selected.rowNumber + direction,
    );

    this.props.onRowSelected({
      props: {
        data: newSelected,
        fromKey: true,
      },
    });
  };

  render() {
    const {
      tableMeta,
      renderers,
      onRowSelected,
      selected,
      selectField,
      title,
      noTitle,
      noFilter,
      enableSort,
      noDataMessage,
      className,
      noHeader,
      noCustomButton = false,
      refreshable,
      highlight,
      serverPagination,
      externalChangeSort,
      withPerPageSelector,
    } = this.props;
    const { initialSort, initialSortAscending, isHierarchical } = this.state;

    const tableMetaCols = tableMeta.cols;
    const { data } = this.state;

    const columnMetadata = this.initializeMetadata(tableMetaCols, renderers);
    const tableCols = columnMetadata.map((m) => m.columnName);
    const rowMetadata = this.initializeRowMetadata();
    const tableClassName = cx('data-table', className);

    const results = this.processTableData(
      data,
      tableCols,
      selected,
      selectField,
      onRowSelected,
      highlight,
    );

    return (
      <Div className={tableClassName}>
        <Div className="some-header" hidden={noHeader}>
          <DataTableHeadLine>
            <DataTableHeadLineTitle>
              {noTitle ? '' : title}
            </DataTableHeadLineTitle>
            <div className="waybills-buttons">
              {!noFilter && (
                <FilterButton
                  active={!!Object.keys(this.state.filterValues).length}
                  onClick={this.toggleFilter}
                />
              )}
              {refreshable && (
                <EtsBootstrap.Button
                  bsSize="small"
                  onClick={this.props.onRefresh}>
                  <EtsBootstrap.Glyphicon glyph="refresh" />
                </EtsBootstrap.Button>
              )}
              {!noCustomButton && this.props.children}
            </div>
          </DataTableHeadLine>
          {!noFilter && (
            <Filter
              show={this.state.filterModalIsOpen}
              onSubmit={this.saveFilter}
              onHide={this.closeFilter}
              values={this.state.filterValues}
              options={tableMetaCols.filter((el) => el.filter !== false)}
              tableData={this.props.defaulResult || this.props.results}
              entity={this.props.entity}
              reportKey={this.props.reportKey}
              loadDependecyData={this.props.loadDependecyData}
            />
          )}
        </Div>
        {/* lowerCaseSorting - сортировка в этом компоненте, а не в griddle.getDataForRender */}
        <SimpleGriddle
          checked={this.props.checked}
          uniqKey={this.state.uniqKey}
          selectField={this.props.selectField}
          results={results}
          enableSort={enableSort}
          initialSort={initialSort}
          initialSortAscending={initialSortAscending}
          columnMetadata={columnMetadata}
          columns={tableCols}
          resultsPerPage={this.state.perPageLocal}
          externalChangeSort={externalChangeSort || this.handleChangeSort}
          onRowClick={!isHierarchical ? onRowSelected : null}
          onRowDoubleClick={this.props.onRowDoubleClick}
          onRowClickNew={this.props.onRowClick}
          rowMetadata={rowMetadata}
          onKeyPress={this.handleKeyPress}
          noDataMessage={noDataMessage || noFilter ? '' : 'Нет данных'}
          rowNumberOffset={serverPagination ? this.props.rowNumberOffset : 0}
          handleRowCheck={this.handleRowCheck}
          serverPagination={serverPagination}
          currentPage={this.state.currentPage}
          globalCheckHandler={this.globalCheckHandler}
          reportKey={this.props.reportKey}
          localState={this.props.localState}
        />
        {serverPagination ? (
          <div />
        ) : (
          <Paginator
            currentPage={this.state.currentPage}
            maxPage={Math.ceil(results.length / this.state.perPageLocal)}
            setPage={this.setPage}
            setPerPage={this.setPerPage}
            withPerPageSelector={withPerPageSelector}
          />
        )}
      </Div>
    );
  }
}
