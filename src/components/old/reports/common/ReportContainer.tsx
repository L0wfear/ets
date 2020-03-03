import * as React from 'react';
import { bindActionCreators } from 'redux';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as queryString from 'query-string';
import {
  difference,
  identity,
  isEmpty,
  isEqual,
  omit,
  pick,
  uniqBy,
  get,
} from 'lodash';

import Title from 'components/old/reports/common/Title';
import { filterFunction } from 'components/old/ui/tableNew/utils';
import {
  IDataTableSelectedRow,
  IDataTableColFilter,
} from 'components/old/ui/table/@types/schema.h';
import { IReactSelectOption } from 'components/old/ui/@types/ReactSelect.h';
import {
  IPropsReportContainer,
  IStateReportContainer,
} from 'components/old/reports/common/@types/ReportContainer.h';
import { IPropsReportHeaderCommon } from 'components/old/reports/common/@types/ReportHeaderWrapper.h';
import {
  ReportDataPromise,
  IReportTableMeta,
  IReportMetaField,
} from 'components/old/reports/redux-main/modules/@types/report.h';

import PreloadNew from 'components/old/ui/new/preloader/PreloadNew';

import {
  getServerErrorNotification,
  noItemsInfoNotification,
} from 'utils/notifications';
import * as reportActionCreators from 'components/old/reports/redux-main/modules/report';
import DataTable from 'components/old/ui/table/DataTable';
import DataTableNew from 'components/old/ui/tableNew/DataTable';

import { EtsPageWrap } from 'global-styled/global-styled';
import { isArray, isNumber, isNull } from 'util';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.
const Table: any = DataTable;

class ReportContainer extends React.Component<
  IPropsReportContainer,
  IStateReportContainer
> {
  constructor(props) {
    super(props);
    this.state = {
      fetchedBySubmitButton: false,
      fetchedByMoveDownButton: false,
      exportFetching: false,
      selectedRow: null,
      filterValues: get(props, 'tableProps.filterValuesRaw', {}),
      uniqName: props.uniqName || '_uniq_field',
      localState: {},
    };
  }

  componentDidMount() {
    // Так как стор один на все отчёты, необходимо его чистить в начале.
    this.props.setInitialState();
    const {
      location: { search },
    } = this.props;
    const searchObject = queryString.parse(search);
    if (this.props.setDateRange) {
      const {level, ...dateRange} = searchObject;
      this.props.setDateRange(dateRange);
    }

    if (Object.keys(searchObject).length > 0) {
      try {
        this.getReportData(searchObject);
      } catch (e) {
        console.warn(e); // tslint:disable-line
        return;
      }
    } else {
      this.getTableMetaInfo();
    }

    if (this.props.titleText || this.props.title) {
      const meta = document.querySelector('meta[property="og:title"]');
      const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
      const new_title = `${etsName} ${this.props.titleText || this.props.title}`;

      if (document) {
        document.title = new_title;
      }
      if (meta) {
        meta.setAttribute('content', new_title);
      }
    }
  }

  componentWillUnmount() {
    const etsName = __DEVELOPMENT__ ? `__ETS::${process.env.STAND.toUpperCase()}__` : 'ЕТС';
    const meta = document.querySelector('meta[property="og:title"]');

    if (document) {
      document.title = etsName;
    }
    if (meta) {
      meta.setAttribute('content', etsName);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      location: { search },
    } = prevProps;
    const {
      location: { search: search_next },
    } = this.props;

    const searchObject = queryString.parse(search);
    const searchNextxObject = queryString.parse(search_next);

    if (this.props.setDateRange) {
      const {level, ...dateRange} = searchObject;
      this.props.setDateRange(dateRange);
    }

    // Если урл поменялся и он не пустой, то делаем запрос данных.
    if (!isEqual(searchObject, searchNextxObject)) {
      if (Object.keys(searchNextxObject).length > 0) {
        try {
          this.getReportData(searchNextxObject);
        } catch (e) {
          console.warn(e); // tslint:disable-line
          return;
        }
      } else {
        this.getTableMetaInfo();
        this.props.setInitialState();
      }
    }

    // удаляем из фильтров значения, которых нет в основном списке
    if (this.props.data !== this.props.data) {
      const { data: old_data } = this.props;
      let rows = get(old_data, ['result', 'rows'], null);
      const deepArr = rows && rows.some((blockData) => isArray(blockData.rows));
      if (deepArr) {
        rows = rows.reduce((newArr: Array<any>, blockData) => {
          newArr.push(...blockData.rows);

          return newArr;
        }, []);
      }

      if (!this.props.reportDataFetching) {
        const { filterValues } = prevState;
        this.setState({
          filterValues: Object.entries(filterValues).reduce(
            (newObj, [key, data]: any) => {
              if (rows.some((rowData) => key in rowData)) {
                if (data.type === 'multiselect') {
                  if (rows.some((rowData) => {
                    const keyValue = rowData[key];
                    return data.value.includes(keyValue);
                  })) {
                    newObj[key] = data;
                  }
                } else {
                  newObj[key] = data;
                }
              }

              return newObj;
            },
            {},
          ),
        });
      }
    }

    // фильтруем список
    if (this.state.filterValues !== prevState.filterValues || this.props.data !== prevProps.data) {
      if (this.props.notUseServerSummerTable) {
        const { data: old_data } = this.props;
        let rows = get(old_data, ['result', 'rows'], null);
        const deepArr = rows && rows.some((blockData) => isArray(blockData.rows));
        if (deepArr) {
          rows = rows.reduce((newArr: Array<any>, blockData) => {
            newArr.push(...blockData.rows);

            return newArr;
          }, []);
        }

        if (rows) {
          const data = {
            ...old_data,
            result: {
              ...old_data.result,
            },
          };
          if (deepArr) {
            data.result.rows = data.result.rows.map((blockData) => ({
              ...blockData,
              rows: filterFunction(blockData.rows, { filterValues: this.state.filterValues }),
            })).filter((blockData) => blockData.rows.length);
          } else {
            data.result.rows = filterFunction(rows, { filterValues: this.state.filterValues });
          }

          const reportKey = get(this.props, 'tableProps.reportKey', null);

          this.props.setReportDataWithSummerData({
            data,
            props: { ...this.state, notUseServerSummerTable: this.props.notUseServerSummerTable, reportKey },
          });
        }
      }
    }
  }

  getReportData(query): ReportDataPromise {

    if (query.okrug_id === '' || isNull(query.okrug_id)) {
      query.okrug_id = 0;
    }
    if (query.district_id === '' || isNull(query.district_id)) {
      query.district_id = 0;
    }

    const payload: any = {...query};

    return new Promise(async (resolve, reject) => {
      try {
        const { notUseServerSummerTable } = this.props;
        const reportKey = get(this.props, 'tableProps.reportKey', null);

        const data = await this.props.getReportData(
          this.props.serviceName,
          payload,
          '',
          { ...this.state, notUseServerSummerTable, reportKey },
        );
        const hasSummaryLevel = 'summary' in data.result.meta.levels;

        if (this.state.fetchedByMoveDownButton && !notUseServerSummerTable) {
          const prevFields
            = get(this.props.prevTableMetaInfo, 'fields', []) || [];

          this.props.setSummaryTableData({
            summaryList: [this.state.selectedRow],
            summaryMeta: { ...this.props.prevMeta },
            summaryTableMetaInfo: [...prevFields],
          });
          this.setState({
            fetchedByMoveDownButton: false,
            selectedRow: null,
          });
        } else if (hasSummaryLevel && !notUseServerSummerTable) {
          const summaryQuery = {
            ...payload,
            level: data.result.meta.levels.summary.level,
          };

          try {
            await this.props.getReportData(
              this.props.serviceName,
              summaryQuery,
              'summary',
            );
          } catch (e) {
            console.warn(e); // tslint:disable-line
          }
        }

        if (data.result.rows.length === 0) {
          noItemsInfoNotification();
        }

        resolve(data);
      } catch (errorData) {
        if (!errorData.errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify(
            getServerErrorNotification(
              `${this.props.serviceUrl}: ${errorData.error_text}`,
            ),
          );
        }
        reject({ ...errorData, errorIsShow: true });
      }
    });
  }

  getTableMetaInfo() {
    try {
      this.props.getTableMetaInfo(this.props.serviceName);
    } catch (errorData) {
      if (!errorData.errorIsShow) {
        global.NOTIFICATION_SYSTEM.notify(
          getServerErrorNotification(
            `${this.props.serviceUrl}: ${errorData.error_text}`,
          ),
        );
      }
    }
  }

  handleReportSubmit = async (headerData: object) => {
    const {
      location: { search },
    } = this.props;
    const searchObject = queryString.parse(search);

    try {
      // Если урл пустой, то делаем запрос на основе параметров из хедера.
      if (Object.keys(searchObject).length === 0) {
        const payload: any = { ...headerData };

        let data = null;

        try {
          data = await this.getReportData(payload);
        } catch (e) {
          console.warn(e); // tslint:disable-line
          return;
        }

        if (get(data, ['result', 'rows'], []).length === 0) {
          return;
        }

        const query = {
          ...headerData,
          level: data.result.meta.levels.current.level,
        };

        /**
         * Сделано синхронно, чтобы на момент изменения просов с урлом стейт был уже обновлён.
         */
        this.setState(() => {
          this.props.history.push(
            `${this.props.reportUrl}?${queryString.stringify(query)}`,
          );

          return {
            fetchedBySubmitButton: true,
          };
        });

        return;
      }

      /**
       * Если урл не пустой, то берём из него только мета-информацию.
       */
      const newQuery = {
        ...headerData,
        ...pick(searchObject, this.props.meta.levels.current.filter),
        level: this.props.meta.levels.current.level,
      };

      /**
       * Не пишем историю при одинаковых запросах.
       * Соотвественно новый запрос на сервер будет игнорирован.
       */
      if (isEqual(searchObject, newQuery)) {
        this.getReportData(newQuery);
        return;
      }

      this.props.history.push(
        `${this.props.reportUrl}?${queryString.stringify(newQuery)}`,
      );
    } catch (errorData) {
      if (!errorData.errorIsShow) {
        global.NOTIFICATION_SYSTEM.notify(
          getServerErrorNotification(
            `${this.props.serviceUrl}: ${errorData.error_text}`,
          ),
        );
      }
    }
  };

  externalFilter = (filterValues: any) => {
    this.setState({ filterValues });
  };

  handleMoveDown = (selectedRow: IDataTableSelectedRow) => {
    const moveDownIsPermitted = 'lower' in this.props.meta.levels;
    if (!moveDownIsPermitted) {
      return;
    }

    const lowerLevel = this.props.meta.levels.lower.level;
    const lowerLevelFilters = this.props.meta.levels.lower.filter;
    const lowerLevelSelectors = this.props.meta.levels.lower.filter
      .map((selector) => ({ [selector]: selectedRow.props.data[selector] }))
      .reduce((prev, next) => ({ ...prev, ...next }));

    const currentLevelFilters = this.props.meta.levels.current.filter;
    const {
      location: { search },
    } = this.props;
    const searchObject = queryString.parse(search);

    const query = {
      ...searchObject,
      level: lowerLevel,
      ...lowerLevelSelectors,
    };

    const filterDifference = difference(currentLevelFilters, lowerLevelFilters);
    const filteredQuery = omit(query, filterDifference);

    this.setState((prevState) => {
      this.props.history.push(
        `${this.props.reportUrl}?${queryString.stringify(filteredQuery)}`,
      );

      return {
        fetchedByMoveDownButton: true,
        selectedRow: selectedRow.props.data,
      };
    });
  };

  handleMoveUp = () => {
    const higherLevel = this.props.meta.levels.higher.level;
    const currentLevelSelectors = this.props.meta.levels.current.filter;
    const {
      location: { search },
    } = this.props;
    const searchObject = queryString.parse(search);

    const query = {
      ...searchObject,
      level: higherLevel,
    };

    const filteredQuery = omit(query, currentLevelSelectors);

    this.props.history.push(
      `${this.props.reportUrl}?${queryString.stringify(filteredQuery)}`,
    );
  };

  reportRowFormatFromMeta = (reportRowValue, metaFieldsByKey) => {
    const newRow = Object.entries(reportRowValue).reduce((newObj, [key, elemVal] ) => {
      const precision = metaFieldsByKey[key]?.precision;
      let newVal = precision && isNumber(elemVal)
        ? elemVal?.toFixed(precision).replace(',', '.')
        : elemVal;

      // const { //<<< перенести в 33й,
      //   renderers
      // } = this.props;

      // if(renderers) {
      //   const renderersFunc = renderers[key];
      //   const newValBeforeRenderers = newVal;
      //   newVal = renderersFunc
      //     ? renderersFunc({ data: newVal, rowData: reportRowValue, }, this.props)
      //     : newVal;
      //   if(isObject(newVal)) { // в renderers иногда передаются компоненты с версткой, если так, то мы просто отправляем значение(без верстки) на печать
      //     newVal = newValBeforeRenderers;
      //   }
      // }
      
      return {
        ...newObj,
        [key]: newVal,
      };
    }, {});

    return newRow;
  };

  makeSummaryByKey = (fields: Array<IReportMetaField>) => fields.reduce((newObj, currVal) => {
    const newKey = Object.keys(currVal)?.[0];
    return {
      ...newObj,
      [newKey]: {
        ...currVal[newKey],
      },
    };
  }, {});;

  handleReportPrint = async () => {
    const {
      location: { search },
    } = this.props;
    const searchObject = queryString.parse(search);

    this.setState({ exportFetching: true });

    const metaFieldsByKey = this.makeSummaryByKey(get(this.props, 'meta.fields', []));
    const metaFieldsSummaryByKey = this.makeSummaryByKey( get(this.props, 'summaryMeta.fields', []));

    let payload: any = {
      rows: [...this.props.list].map((elem) => this.reportRowFormatFromMeta(elem, metaFieldsByKey)),
    };

    if (this.props.notUseServerSummerTable) {
      const reportKey = get(this.props, 'tableProps.reportKey', null);
      let report = [...this.props.list];
      let summary = [...this.props.summaryList];

      if (reportKey === 'car_usage_report') {
        const schema = Object.fromEntries(
          this.makeTableSchema(
            this.props.schemaMakers,
            this.props.additionalSchemaMakers || [],
            this.props.tableMetaInfo,
            'mainList',
          ).cols.map((rowData) => [rowData.name, rowData]),
        );
        const show_gov_numbers = get(this.state, 'localState.show_gov_numbers');

        report = report.map((d: any) => {
          Object.entries(schema).forEach(([key, metaRender]: any) => {
            if (key in d && (metaRender.needStr || metaRender.make_str_gov_number_format)) {
              const count = get(d[key], 'count');
              const data = get(d[key], 'gov_numbers') || [];

              d[`${key}_str`] = `${count}`;
              if (show_gov_numbers && data.length) {
                d[`${key}_str`] = `${d[`${key}_str`]}:\n${data.sort().join('\n')}`;
              }
            }
          });
          return d;
        });

        summary = summary.map((d: any) => {
          Object.entries(schema).forEach(([key, metaRender]: any) => {
            if (key in d && (metaRender.needStr || metaRender.make_str_gov_number_format)) {
              const count = d[key];

              d[`${key}_str`] = `${count}`;
            }
          });
          return d;
        });
      }

      payload = {
        rows: {
          report: report.map((elem) => this.reportRowFormatFromMeta(elem, metaFieldsByKey)),
          summary: summary.map(
            (elem) => ({
              ...elem,
              children: elem?.children?.map(
                (child) => this.reportRowFormatFromMeta(child, metaFieldsSummaryByKey)
              )
            })
          ),
        },
      };
    }

    try {
      await this.props.exportByPostData(payload, searchObject);
    } catch (e) {
      console.warn(e); // tslint:disable-line
    }

    this.setState({ exportFetching: false });
  };

  makeTableSchema(
    schemaMakers = {},
    additionalSchemaMakers,
    tableMetaInfo: IReportTableMeta,
    forWhat,
  ) {
    const fields = get(tableMetaInfo, 'fields', []) || [];
    const cols = fields
      .reduce((tableMeta, field) => {
        const [[fieldName, { name: displayName, is_row, display = true, type = 'multiselect', filter = true, sortable = true, sort_by, make_str_gov_number_format, precision, }]] = Object.entries(
          field,
        );

        if (!is_row) {
          let initialSchema: any;

          initialSchema = {
            name: fieldName,
            displayName,
            display,
            sort_by,
            sortable,
            make_str_gov_number_format,
            precision,
          };
          let renderer: any = identity;
          if (schemaMakers[fieldName]) {
            renderer = schemaMakers[fieldName];
          }
          if (filter) {
            initialSchema.filter = {
              type,
            };
            if (type === 'multiselect') {
              initialSchema.options = undefined;
              let customOptions = [];
              if(renderer){
                const rendererSchemaObj = renderer(initialSchema, this.props);
                customOptions = get(rendererSchemaObj, 'filter.options', []);
              }

              if(customOptions.length) {
                initialSchema.options = [...customOptions];
              }

              if (!customOptions.length && forWhat === 'mainList' && this.props.data.result && type === 'multiselect') {
                (initialSchema.filter as IDataTableColFilter).options = uniqBy<IReactSelectOption>(
                  this.props.data.result.rows.map(
                    ({ [fieldName]: value }: any) => ({ value, label: value }),
                  ),
                  'value',
                ).filter(({ value }) => Boolean(value));
              }
            }
          } else {
            initialSchema.filter = false;
          }
          tableMeta.push(renderer(initialSchema, this.props));
        }
        return tableMeta;
      }, [])
      .concat(...additionalSchemaMakers);

    return { cols };
  }

  setLocalState = (obj: Partial<IStateReportContainer['localState']>) => {
    this.setState((oldState) => ({
      ...oldState,
      localState: {
        ...oldState.localState,
        ...obj,
      },
    }));
  };

  render() {
    const {
      enumerated = false,
      enumeratedChildren = false,
      enableSort = true,
      initialSort = false,
      schemaMakers,
      summarySchemaMakers,
      tableMetaInfo,
      summaryTableMetaInfo,
      additionalSchemaMakers = [],
      location: { search },
    } = this.props;

    const reportKey = get(this.props, 'tableProps.reportKey', null);

    const Header: React.ComponentClass<IPropsReportHeaderCommon> = this.props
      .headerComponent;

    const tableMeta = this.makeTableSchema(
      schemaMakers,
      additionalSchemaMakers,
      tableMetaInfo,
      'mainList',
    );
    const summaryTableMeta = this.makeTableSchema(
      summarySchemaMakers,
      [],
      { fields: summaryTableMetaInfo },
      'summaryList',
    );

    const moveUpIsPermitted = 'higher' in this.props.meta.levels;
    const isListEmpty = this.props.list.length === 0;

    const preloader = (this.props.reportMetaFetching
      || this.props.reportDataFetching
      || this.state.exportFetching) && <PreloadNew typePreloader="mainpage" />;
    const moveUpButton = moveUpIsPermitted && (
      <EtsBootstrap.Button bsSize="small" onClick={this.handleMoveUp}>
        На уровень выше
      </EtsBootstrap.Button>
    );

    const isSummaryEnable
      =  reportKey === 'fuel_cards_report' // fuel_cards_report - одноуровневый отчет
        ? this.props.summaryList.length > 0
        : 'summary' in this.props.meta.levels && this.props.summaryList.length > 0;

    const summaryTable
      = (this.props.notUseServerSummerTable && isSummaryEnable ? (
        <DataTableNew
          title={this.props.summaryTitle || 'Итого'}
          tableMeta={summaryTableMeta}
          data={this.props.summaryList}
          enableSort={false}
          enumerated={enumerated && enumeratedChildren}
          uniqName={this.state.uniqName}
          noFilter
        />
      ) : ( isSummaryEnable
        && <Table
          className="data-other"
          title={'Итого'}
          tableMeta={summaryTableMeta}
          results={this.props.summaryList}
          renderers={this.props.summaryRenderes || {}}
          onRowSelected={undefined}
          enumerated={enumerated}
          enableSort={false}
          noFilter
        />
      ));

    /**
     * Через специальный для каждого хедера колбэк обрабатываются параметры урла,
     * которые должны быть в специальном для каждого элемента ввода формате.
     */
    const stateMaker = this.props.headerStateMaker || identity;
    const queryObject = queryString.parse(search);
    const queryState = stateMaker(queryObject);

    const mergedTableMetaInfo = {
      ...tableMetaInfo,
      ...this.props.meta,
    };

    const title = isEmpty(mergedTableMetaInfo.name) ? (
      this.props.title
    ) : (
      <Title
        text={mergedTableMetaInfo.name}
        hint={mergedTableMetaInfo.description}
      />
    );

    return (
      <EtsPageWrap inheritDisplay>
        <Header
          tableMeta={mergedTableMetaInfo}
          queryState={queryState}
          onClick={this.handleReportSubmit}
          readOnly={false}
          localState={this.state.localState}
          setLocalState={this.setLocalState}
        />
        <Table
          title={title}
          tableMeta={tableMeta}
          results={this.props.list}
          renderers={this.props.renderers || {}}
          onRowSelected={this.handleMoveDown}
          enumerated={enumerated}
          enableSort={enableSort}
          initialSort={initialSort || ''}
          externalFilter={this.externalFilter}
          needMyFilter={!this.props.notUseServerSummerTable}
          filterValues={this.state.filterValues}
          onRowDoubleClick={this.props.onRowDoubleClick}
          useServerFilter
          localState={this.state.localState}
          {...this.props.tableProps}>
          <EtsBootstrap.Button
            bsSize="small"
            disabled={isListEmpty}
            onClick={this.handleReportPrint}>
            <EtsBootstrap.Glyphicon glyph="download-alt" />
          </EtsBootstrap.Button>
          {moveUpButton}
        </Table>
        {summaryTable}
        {preloader}
      </EtsPageWrap>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.reports,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators<any, any>(reportActionCreators, dispatch);

export default compose<IPropsReportContainer, any>(
  withSearch,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(ReportContainer);
