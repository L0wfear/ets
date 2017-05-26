import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import {
  omit,
  isEqual,
  difference,
  identity,
  pick,
} from 'lodash';

import { IDataTableColSchema, IDataTableSelectedRow } from 'components/ui/table/@types/DataTable/schema.h';
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
      fetchedByButton: false,
    };
  }
  componentDidMount() {
    // Так как стор один на все отчёты, необходимо его чистить в начале.
    this.props.setInitialState();
    if (Object.keys(this.props.location.query).length > 0) {
      this.getReportData(this.props.location.query);
    } else {
      this.getTableMetaInfo();
    }
  }

  async componentWillReceiveProps(nextProps: IPropsReportContainer) {
    const { query } = this.props.location;
    const nextQuery = nextProps.location.query;

    // Если урл поменялся и он не пустой, то делаем запрос данных.
    if (!isEqual(query, nextQuery)) {
      /**
       * Первый запрос с кнопки меняет урл, поэтому происходит повторный запрос.
       * Данная проверка исключает такую ситуацию.
       */
      if (this.state.fetchedByButton) {
        this.setState({ fetchedByButton: false });
        return;
      }

      if (Object.keys(nextQuery).length > 0) {
        await this.getReportData(nextQuery);
        this.setState({ filterResetting: true });
      } else {
        this.getTableMetaInfo();
        this.props.setInitialState();
        this.setState({ filterResetting: true });
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

        if (data.result.rows.length > 0) {

          if (hasSummaryLevel) {
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
    const locationQuery = this.props.location.query;

    try {
      // Если урл пустой, то делаем запрос на основе параметров из хедера.
      if (Object.keys(locationQuery).length === 0) {
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
          this.props.history.pushState(null, this.props.reportUrl, query);

          return {
            fetchedByButton: true,
          };
        });

        return;
      }

      /**
       * Если урл не пустой, то берём из него только мета-информацию.
       */
      const newQuery = {
        ...headerData,
        ...pick(locationQuery, this.props.meta.levels.current.filter),
        level: this.props.meta.levels.current.level,
      };

      /**
       * Не пишем историю при одинаковых запросах.
       * Соотвественно новый запрос на сервер будет игнорирован.
       */
      if (isEqual(locationQuery, newQuery)) {
        return;
      }

      this.props.history.pushState(null, this.props.reportUrl, newQuery);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(`${this.props.serviceUrl}: ${error}`));
    }
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
    const headerState = this.props.location.query;

    const query = {
      ...headerState,
      level: lowerLevel,
      ...lowerLevelSelectors,
    };

    const filterDifference = difference(currentLevelFilters, lowerLevelFilters);
    const filteredQuery = omit(query, filterDifference);

    this.props.history.pushState(null, this.props.reportUrl, filteredQuery);
  }

  handleMoveUp = () => {
    const higherLevel = this.props.meta.levels.higher.level;
    const currentLevelSelectors = this.props.meta.levels.current.filter;
    const headerState = this.props.location.query;

    const query = {
      ...headerState,
      level: higherLevel,
    };

    const filteredQuery = omit(query, currentLevelSelectors);

    this.props.history.pushState(null, this.props.reportUrl, filteredQuery);
  }

  handleReportPrint = () => {
    this.props.export(this.props.location.query);
  }

  makeTableSchema(schemaMakers = {}, tableMetaInfo: IReportTableMeta) {
    const cols = tableMetaInfo.fields.map(field => {
      const fieldName = Object.keys(field)[0];
      const fieldValue = field[fieldName];

      const initialSchema: IDataTableColSchema = {
        name: fieldName,
        displayName: fieldValue.name,
      };

      const renderer = schemaMakers[fieldName] || identity;
      const finalSchema = renderer(initialSchema, this.props);

      return finalSchema;
    });

    return { cols };
  }

  render() {
    const {
      enumerated = false,
      enableSort = true,
      schemaMakers,
      tableMetaInfo,
      summaryTableMetaInfo,
    } = this.props;

    const Header: React.ComponentClass<IPropsReportHeaderCommon> = this.props.headerComponent;

    const tableMeta = this.makeTableSchema(schemaMakers, tableMetaInfo);
    const summaryTableMeta = this.makeTableSchema({}, { fields: summaryTableMetaInfo });

    const moveUpIsPermitted = 'higher' in this.props.meta.levels;
    const isListEmpty = this.props.list.length === 0;

    const preloader = (
      (this.props.reportMetaFetching || this.props.reportDataFetching) &&
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
        enumerated={false}
        enableSort={false}
        noFilter
      />
    );

    /**
     * Через специальный для каждого хедера колбэк обрабатываются параметры урла,
     * которые должны быть в специальном для каждого элемента ввода формате.
     */
    const stateMaker = this.props.headerStateMaker || identity;
    const queryState = stateMaker(this.props.location.query);

    const mergedTableMetaInfo = {
      ...tableMetaInfo,
      ...this.props.meta,
    };

    return (
      <div className="ets-page-wrap">
        <Header
          tableMeta={mergedTableMetaInfo}
          queryState={queryState}
          onClick={this.handleReportSubmit}
          readOnly={moveUpIsPermitted}
        />
        <Table
          title={this.props.title}
          tableMeta={tableMeta}
          results={this.props.list}
          renderers={this.props.renderers || {}}
          onRowSelected={this.handleMoveDown}
          enumerated={enumerated}
          enableSort={enableSort}
          filterResetting={this.state.filterResetting}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportContainer);
