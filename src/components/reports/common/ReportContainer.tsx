import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import * as queryString from 'query-string';
import {
  omit,
  isEqual,
  difference,
  identity,
  pick,
  isEmpty,
} from 'lodash';

import Title from './Title';

import { IDataTableColSchema, IDataTableSelectedRow } from 'components/ui/table/@types/schema.h';
import { IPropsReportContainer, IStateReportContainer } from './@types/ReportContainer.h';
import { IPropsReportHeaderCommon } from './@types/ReportHeaderWrapper.h';
import { ReportDataPromise, IReportTableMeta } from 'components/reports/redux/modules/@types/report.h';

import Preloader from 'components/ui/Preloader.jsx';
import { getServerErrorNotification, noItemsInfoNotification } from 'utils/notifications';
import * as reportActionCreators from 'components/reports/redux/modules/report';
import DataTable from 'components/ui/table/DataTable.jsx';

// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.
const Table: any = DataTable;

class ReportContainer extends React.Component<IPropsReportContainer, IStateReportContainer> {
  constructor() {
    super();
    this.state = {
      filterResetting: false,
      fetchedBySubmitButton: false,
      fetchedByMoveDownButton: false,
      exportFetching: false,
      selectedRow: null,
    };
  }
  componentDidMount() {
    // Так как стор один на все отчёты, необходимо его чистить в начале.
    this.props.setInitialState();
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    if (Object.keys(searchObject).length > 0) {
      this.getReportData(searchObject);
    } else {
      this.getTableMetaInfo();
    }
  }

  async componentWillReceiveProps(nextProps: IPropsReportContainer) {
    const {
      location: { search },
      useServerFilter = false,
    } = this.props;
    const { location: { search: search_next } } = nextProps;

    const searchObject = queryString.parse(search);
    const searchNextxObject = queryString.parse(search_next);

    // Если урл поменялся и он не пустой, то делаем запрос данных.
    if (!isEqual(searchObject, searchNextxObject)) {
      /**
       * Первый запрос с кнопки меняет урл, поэтому происходит повторный запрос.
       * Данная проверка исключает такую ситуацию.
       */
      if (this.state.fetchedBySubmitButton) {
        this.setState({ fetchedBySubmitButton: false });
        return;
      }

      if (Object.keys(searchNextxObject).length > 0) {
        await this.getReportData(searchNextxObject);
        this.setState({ filterResetting: useServerFilter ? false : true });
      } else {
        this.getTableMetaInfo();
        this.props.setInitialState();
        this.setState({ filterResetting: useServerFilter ? false : true });
      }
    } else {
      this.setState({ filterResetting: false });
    }
  }

  getReportData(query): ReportDataPromise {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.props.getReportData(this.props.serviceName, query);
        const hasSummaryLevel = 'summary' in data.result.meta.levels;

        if (this.state.fetchedByMoveDownButton) {
          this.props.setSummaryTableData({
            summaryList: [this.state.selectedRow],
            summaryMeta: {...this.props.prevMeta},
            summaryTableMetaInfo: [...this.props.prevTableMetaInfo.fields],
          });
          this.setState({
            fetchedByMoveDownButton: false,
              selectedRow: null,
          });
        } else if (hasSummaryLevel) {
          const summaryQuery = {
            ...query,
            level: data.result.meta.levels.summary.level,
          };

          await this.props.getReportData(
            this.props.serviceName,
            summaryQuery,
            'summary',
          );
        }

        if (data.result.rows.length === 0) {
          noItemsInfoNotification();
        }

        resolve(data);
      } catch (error) {
        global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${error}`));
        reject(error);
      }
    });
  }

  getTableMetaInfo() {
    try {
      this.props.getTableMetaInfo(this.props.serviceName);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${error}`));
    }
  }

  handleReportSubmit = async (headerData: object) => {
    const {
      location: {
        search,
      },
    } = this.props;
    const searchObject = queryString.parse(search);

    try {
      // Если урл пустой, то делаем запрос на основе параметров из хедера.
      if (Object.keys(searchObject).length === 0) {
        const data = await this.getReportData(headerData);

        if (data.result.rows.length === 0) {
          return;
        }

        const query = {
          ...headerData,
          level: data.result.meta.levels.current.level,
        };

        /**
         * Сделано синхронно, чтобы на момент изменения просов с урлом стейт был уже обновлён.
         */
        this.setState(prevState => {
          this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(query)}`);

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
        return;
      }

      this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(newQuery)}`);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${error}`));
    }
  }

  externalFilter = (filter: any) => {
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    this.handleReportSubmit({
      ...searchObject,
      filter: JSON.stringify(filter),
    });
  }

  handleMoveDown = (selectedRow: IDataTableSelectedRow) => {
    const moveDownIsPermitted = 'lower' in this.props.meta.levels;
    if (!moveDownIsPermitted) {
      return;
    }

    const lowerLevel = this.props.meta.levels.lower.level;
    const lowerLevelFilters = this.props.meta.levels.lower.filter;
    const lowerLevelSelectors = this.props.meta.levels.lower.filter
      .map(selector => ({[selector]: selectedRow.props.data[selector] }))
      .reduce((prev, next) => ({ ...prev, ...next }));

    const currentLevelFilters = this.props.meta.levels.current.filter;
    const { location: { search } } = this.props;
    const searchObject = queryString.parse(search);

    const query = {
      ...searchObject,
      level: lowerLevel,
      ...lowerLevelSelectors,
      filter: '{}',
    };

    const filterDifference = difference(currentLevelFilters, lowerLevelFilters);
    const filteredQuery = omit(query, filterDifference);

    this.setState(prevState => {
      this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(filteredQuery)}`);

      return {
        fetchedByMoveDownButton: true,
        selectedRow: selectedRow.props.data,
      };
    });

  }

  handleMoveUp = () => {
    const higherLevel = this.props.meta.levels.higher.level;
    const currentLevelSelectors = this.props.meta.levels.current.filter;
    const {
      location: {
        search,
      },
    } = this.props;
    const searchObject = queryString.parse(search);

    const query = {
      ...searchObject,
      level: higherLevel,
      filter: '{}',
    };

    const filteredQuery = omit(query, currentLevelSelectors);

    this.props.history.push(`${this.props.reportUrl}?${queryString.stringify(filteredQuery)}`);
  }

  handleReportPrint = async () => {
    const {
      location: {
        search,
      },
    } = this.props;
    const searchObject = queryString.parse(search);

    this.setState({ exportFetching: true });
    await this.props.export(searchObject);
    this.setState({ exportFetching: false });
  }

  makeTableSchema(schemaMakers = {}, additionalSchemaMakers = [], tableMetaInfo: IReportTableMeta) {
    const { useServerFilter = false } = this.props;

    const cols = tableMetaInfo.fields.map(field => {
      const [[fieldName, { name: displayName, filter_field }]] = Object.entries(field);
      let initialSchema: IDataTableColSchema;

      if (useServerFilter) {
        initialSchema = {
          name: fieldName,
          displayName,
          filter: {
            type: 'multiselect',
            byKey: filter_field || fieldName,
            byLabel: fieldName,
          },
        };
      } else {
        initialSchema = {
          name: fieldName,
          displayName,
          filter: {
            type: 'multiselect',
          },
        };
      }

      const renderer = schemaMakers[fieldName] || identity;
      const finalSchema = renderer(initialSchema, this.props);

      return finalSchema;
    }).concat(...additionalSchemaMakers);

    return { cols };
  }

  render() {
    const {
      enumerated = false,
      enableSort = true,
      initialSort = false,
      schemaMakers,
      tableMetaInfo,
      summaryTableMetaInfo,
      additionalSchemaMakers,
      useServerFilter = false,
      location: { search },
    } = this.props;

    const Header: React.ComponentClass<IPropsReportHeaderCommon> = this.props.headerComponent;

    const tableMeta = this.makeTableSchema(schemaMakers, additionalSchemaMakers, tableMetaInfo);
    const summaryTableMeta = this.makeTableSchema({}, [], { fields: summaryTableMetaInfo });

    const moveUpIsPermitted = 'higher' in this.props.meta.levels;
    const isListEmpty = this.props.list.length === 0;

    const preloader = (
      (
        this.props.reportMetaFetching ||
        this.props.reportDataFetching ||
        this.state.exportFetching
      ) &&
      <Preloader type="mainpage"/>
    );
    const moveUpButton = (
      moveUpIsPermitted &&
      <Button bsSize="small" onClick={this.handleMoveUp}>На уровень выше</Button>
    );

    const isSummaryEnable = (
      'summary' in this.props.meta.levels &&
      this.props.summaryList.length > 0
    );

    const summaryTable = (isSummaryEnable &&
      <Table
        title={'Итого'}
        tableMeta={summaryTableMeta}
        results={this.props.summaryList}
        renderers={this.props.summaryRenderes || {}}
        onRowSelected={undefined}
        enumerated={enumerated}
        enableSort={false}
        noFilter
      />
    );

    /**
     * Через специальный для каждого хедера колбэк обрабатываются параметры урла,
     * которые должны быть в специальном для каждого элемента ввода формате.
     */
    const stateMaker = this.props.headerStateMaker || identity;
    const queryObject = queryString.parse(search);
    const queryState = stateMaker(queryObject);
    const { filter } = queryObject;

    const mergedTableMetaInfo = {
      ...tableMetaInfo,
      ...this.props.meta,
    };

    const title = isEmpty(mergedTableMetaInfo.name) ?
      this.props.title
      :
      <Title
        text={mergedTableMetaInfo.name}
        hint={mergedTableMetaInfo.description}
      />;

    return (
      <div className="ets-page-wrap">
        <Header
          tableMeta={mergedTableMetaInfo}
          queryState={queryState}
          onClick={this.handleReportSubmit}
          readOnly={false}
        />
        <Table
          title={title}
          tableMeta={tableMeta}
          results={this.props.list}
          renderers={this.props.renderers || {}}
          onRowSelected={this.handleMoveDown}
          enumerated={enumerated}
          enableSort={enableSort}
          filterResetting={this.state.filterResetting}
          initialSort={initialSort || ''}
          externalFilter={useServerFilter && this.externalFilter}
          filterValues={useServerFilter && JSON.parse(filter)}
          {...this.props.tableProps}
        >
          <Button
            bsSize="small"
            disabled={isListEmpty}
            onClick={this.handleReportPrint}
          ><Glyphicon glyph="download-alt" /></Button>
          {moveUpButton}
        </ Table>
        {summaryTable}
        {preloader}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.reports,
});
const mapDispatchToProps = dispatch => bindActionCreators<any>(reportActionCreators, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportContainer));
