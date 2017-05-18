import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import { omit, isEqual, difference } from 'lodash';

import { IDataTableColSchema, IDataTableSelectedRow } from 'components/ui/table/@types/DataTable/schema.h';
import { IPropsReportContainer, IStateReportContainer } from './@types/ReportContainer.h';
import { ReportDataPromise } from 'components/reports/redux/modules/@types/report.h';

import Preloader from 'components/ui/Preloader.jsx';
import { getServerErrorNotification, noItemsInfoNotification } from 'utils/notifications';
import * as reportActionCreators from 'components/reports/redux/modules/report';
import DataTable from 'components/ui/table/DataTable.jsx';

// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.
const Table: any = DataTable;

// Используется, если явно не указан генератор схемы.
const fakeSchemaMaker = (schema, reportProps) => schema;

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

        if (!noItemsInfoNotification(data.result.rows)) {
          const hasSummaryLevel = 'summary' in data.result.meta.levels;

          if (hasSummaryLevel) {
            const summaryQuery = {
              ...query,
              level: data.result.meta.levels.summary.level,
            };

            await this.props.getReportData(this.props.serviceName, summaryQuery, 'summary');
          }
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
    try {
      // Если урл пустой, то делаем запрос на основе параметров из хедера.
      if (Object.keys(this.props.location.query).length === 0) {
        const data = await this.getReportData(headerData);
        if (noItemsInfoNotification(data.result.rows)) {
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

      // Просто меняем урл и его изменение подхватится и будет произведён запрос данных.
      const query = {
        ...this.props.location.query,
        ...headerData,
      };

      // Не пишем истрорию при одинаковых запросах.
      if (isEqual(this.props.location.query, query)) {
        return;
      }

      this.props.history.pushState(null, this.props.reportUrl, query);
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

  makeTableSchema(schemaMakers = {}, tableMetaInfo) {
    const cols = tableMetaInfo.map(field => {
      const fieldName = Object.keys(field)[0];
      const fieldValue = field[fieldName];

      const initialSchema: IDataTableColSchema = {
        name: fieldName,
        displayName: fieldValue.name,
      };

      const renderer = schemaMakers[fieldName] || fakeSchemaMaker;
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

    const Header = this.props.headerComponent;

    const tableMeta = this.makeTableSchema(schemaMakers, tableMetaInfo);
    const summaryTableMeta = this.makeTableSchema({}, summaryTableMetaInfo);

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

    const isSummaryEnable = 'summary' in this.props.meta.levels && this.props.summaryList.length > 0;

    const summaryTable = (isSummaryEnable &&
      <Table
        title={'Итого'}
        tableMeta={summaryTableMeta}
        results={this.props.summaryList}
        renderers={{}}
        onRowSelected={undefined}
        enumerated={false}
        enableSort={false}
        noFilter
      />
    );

    return (
      <div className="ets-page-wrap">
        <Header
          queryState={this.props.location.query}
          onClick={this.handleReportSubmit}
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
