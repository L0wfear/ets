import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import { omit, isEqual } from 'lodash';

import { IDataTableColSchema, IDataTableSelectedRow } from 'components/ui/table/@types/DataTable/schema.h';
import { IPropsReportContainer, IStateReportContainer } from './@types/ReportContainer.h';
import { IResponseData } from 'api/@types/rest.h';

import Preloader from 'components/ui/Preloader.jsx';
import { getServerErrorNotification, noItemsInfoNotification } from 'utils/notifications';
import * as reportActionCreators from 'components/reports/redux/modules/report';
import { HistoryContext } from 'utils/decorators';
import DataTable from 'components/ui/table/DataTable.jsx';

// Хак. Сделано для того, чтобы ts не ругался на jsx-компоненты.
const Table: any = DataTable;

// Используется, если явно не указан генератор схемы.
const fakeSchemaMaker = (schema, reportProps) => schema;

class ReportContainer extends React.Component<IPropsReportContainer, IStateReportContainer> {
  componentWillMount() {
    // Так сторе один на все отчёты, необходимо его чистить в начале.
    this.props.setInitialState();
    if (Object.keys(this.props.location.query).length > 0) {
      this.getReportData(this.props.location.query);
    } else {
      this.getTableMetaInfo();
    }
  }

  componentWillReceiveProps(nextProps: IPropsReportContainer) {
    const { query } = this.props.location;
    const nextQuery = nextProps.location.query;

    // Если урл поменялся и он не пустой, то делаем запрос данных.
    if (!isEqual(query, nextQuery)) {
      if (Object.keys(nextQuery).length > 0) {
        this.getReportData(nextQuery);
      } else {
        this.getTableMetaInfo();
        this.props.setInitialState();
      }
    }
  }

  async getReportData(query) {
    try {
      const data = await this.props.getReportData(this.props.serviceName, query);
      noItemsInfoNotification(data.result.rows);
    } catch (error) {
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(this.props.serviceUrl));
    }
  }

  getTableMetaInfo() {
    try {
      this.props.getTableMetaInfo(this.props.serviceName);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(this.props.serviceUrl));
    }
  }

  handleReportSubmit = async (headerData: object) => {
    try {
      // Если урл пустой, то делаем запрос на основе параметров из хедера.
      if (Object.keys(this.props.location.query).length === 0) {
        const data = await this.props.getReportData(this.props.serviceName, headerData);
        if (noItemsInfoNotification(data.result.rows)) {
          return;
        }

        const query = {
          ...headerData,
          level: data.result.meta.levels.current.level,
        };

        this.props.history.pushState(null, this.props.reportUrl, query);

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
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(this.props.serviceUrl));
    }
  }

  handleMoveDown = (selectedRow: IDataTableSelectedRow) => {
    const moveDownIsPermitted = 'lower' in this.props.meta.levels;
    if (!moveDownIsPermitted) {
      return;
    }

    const lowerLevel = this.props.meta.levels.lower.level;
    const lowerLevelSelector = this.props.meta.levels.lower.pk_field;
    const currentLevelSelector = this.props.meta.levels.current.pk_field;
    const headerState = this.props.location.query;

    const query = {
      ...headerState,
      level: lowerLevel,
      [lowerLevelSelector]: selectedRow.props.data[lowerLevelSelector],
    };

    const filteredQuery = omit(query, currentLevelSelector);

    try {
      // await this.props.getReportData(this.props.serviceName, filteredQuery);
      this.props.history.pushState(null, this.props.reportUrl, filteredQuery);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(this.props.serviceUrl));
    }
  }

  handleMoveUp = () => {
    const higherLevel = this.props.meta.levels.higher.level;
    const currentLevelSelector = this.props.meta.levels.current.pk_field;
    const headerState = this.props.location.query;

    const query = {
      ...headerState,
      level: higherLevel,
    };

    const filteredQuery = omit(query, currentLevelSelector);

    try {
      // await this.props.getReportData(this.props.serviceName, filteredQuery);
      this.props.history.pushState(null, this.props.reportUrl, filteredQuery);
    } catch (error) {
      console.error(error);
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(this.props.serviceUrl));
    }
  }

  handleReportPrint = () => {
    this.props.export(this.props.location.query);
  }

  makeTableSchema() {
    const { schemaMakers = {}, tableMetaInfo } = this.props;

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
    const { enumerated = false, enableSort = true } = this.props;
    const Header = this.props.headerComponent;
    const tableMeta = this.makeTableSchema();
    const moveUpIsPermitted = 'higher' in this.props.meta.levels;
    const moveDownIsPermitted = 'lower' in this.props.meta.levels;
    const isListEmpty = this.props.list.length === 0;
    const currentLevel =  this.props.meta.levels.current.level || '';

    const preloader = (
      (this.props.reportMetaFetching || this.props.reportDataFetching) &&
      <Preloader type="mainpage"/>
    );
    const moveUpButton = (
      moveUpIsPermitted &&
      <Button bsSize="small" onClick={this.handleMoveUp}>На уровень выше</Button>
    );

    return (
      <div className="ets-page-wrap">
        <Header
          queryState={this.props.location.query}
          onClick={this.handleReportSubmit}
          // readOnly={moveUpIsPermitted}
        />
        <Table
          title={this.props.title}
          tableMeta={tableMeta}
          results={this.props.list}
          renderers={this.props.renderers || {}}
          onRowSelected={this.handleMoveDown}
          enumerated={enumerated}
          enableSort={enableSort}
        >
          <Button
            bsSize="small"
            disabled={isListEmpty}
            onClick={this.handleReportPrint}
          ><Glyphicon glyph="download-alt" /></Button>
          {moveUpButton}
        </ Table>
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
