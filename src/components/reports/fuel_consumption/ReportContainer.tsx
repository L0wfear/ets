import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import { omit, isEqual } from 'lodash';

import { IDataTableColSchema, IDataTableSelectedRow } from 'components/ui/table/@types/DataTable/schema.h';
import { IPropsReportContainer, IStateReportContainer } from './ReportContainer.h';

import Preloader from 'components/ui/Preloader.jsx';
import { getServerErrorNotification } from 'utils/notifications';
import * as reportActionCreators from 'components/reports/redux/modules/report';
import { HistoryContext } from 'utils/decorators';
import DataTable from 'components/ui/table/DataTable.jsx';

const Table: any = DataTable;

const fakeSchemaRenderer = (schema, reportProps) => schema;

class ReportContainer extends React.Component<IPropsReportContainer, IStateReportContainer> {
  componentWillMount() {
    if (Object.keys(this.props.location.query).length > 0) {
      this.getInitialReportData(this.props.location.query);
    } else {
      this.getInitiaReportMeta();
    }
  }

  componentWillReceiveProps(nextProps: IPropsReportContainer) {
    const { query } = this.props.location;
    const nextQuery = nextProps.location.query;

    if (!isEqual(query, nextQuery)) {
      if (Object.keys(nextQuery).length > 0) {
        this.getInitialReportData(nextQuery);
      } else {
        this.getInitiaReportMeta();
        this.props.setInitialState();
      }
    }
  }

  getInitialReportData(query) {
    try {
      this.props.getInitialReport(this.props.serviceName, query);
    } catch (error) {
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(error));
    }
  }

  getInitiaReportMeta() {
    try {
      this.props.getTableMetaInfo(this.props.serviceName);
    } catch (error) {
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(error));
    }
  }

  handleReportSubmit = async (headerData: object) => {
    try {
      await this.props.getReportData(this.props.serviceName, headerData);
      const query = {
        ...headerData,
        level: this.props.meta.levels.current.level,
      };
      this.props.history.pushState(null, this.props.reportUrl, query);
    } catch (error) {
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(error));
    }
  }

  handleMoveDown = async (selectedRow: IDataTableSelectedRow) => {
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
      await this.props.getReportData(this.props.serviceName, filteredQuery);
      this.props.history.pushState(null, this.props.reportUrl, filteredQuery);
    } catch (error) {
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(error));
    }
  }

  handleMoveUp = async () => {
    const higherLevel = this.props.meta.levels.higher.level;
    const currentLevelSelector = this.props.meta.levels.current.pk_field;
    const headerState = this.props.location.query;

    const query = {
      ...headerState,
      level: higherLevel,
    };

    const filteredQuery = omit(query, currentLevelSelector);

    try {
      await this.props.getReportData(this.props.serviceName, filteredQuery);
      this.props.history.pushState(null, this.props.reportUrl, filteredQuery);
    } catch (error) {
      global.NOTIFICATION_SYSTEM.notify(getServerErrorNotification(error));
    }
  }

  handleReportPrint = () => {

  }

  makeTableSchema() {
    const { schemaRenderers = {}, tableMetaInfo } = this.props;

    const cols = tableMetaInfo.map(field => {
      const fieldName = Object.keys(field)[0];
      const fieldValue = field[fieldName];

      const initialSchema: IDataTableColSchema = {
        name: fieldName,
        displayName: fieldValue.name,
      };

      const renderer = schemaRenderers[fieldName] || fakeSchemaRenderer;
      const finalSchema = renderer(initialSchema, this.props);

      return finalSchema;
    });

    return { cols };
  }

  render() {
    const Header = this.props.headerComponent;
    const tableMeta = this.makeTableSchema();
    const moveUpIsPermitted = 'higher' in this.props.meta.levels;
    const currentLevel =  this.props.meta.levels.current.level || '';

    const preloader = (
      (this.props.reportMetaFetching || this.props.reportDataFetching) &&
      <Preloader type="mainpage"/>
    );
    const moveUpButton = (
      moveUpIsPermitted &&
      <Button bsSize="small" onClick={this.handleMoveUp}>На уровень выше</Button>
    );
    const title = currentLevel === ''
      ? `${this.props.title}`
      : `${this.props.title} (${currentLevel})`;

    return (
      <div className="ets-page-wrap">
        <Header
          queryState={this.props.location.query}
          onClick={this.handleReportSubmit}
          // readOnly={moveUpIsPermitted}
        />
        <Table
          title={title}
          tableMeta={tableMeta}
          results={this.props.list}
          renderers={this.props.renderers || {}}
          onRowSelected={this.handleMoveDown}
          enumerated={false}
        >
          <Button bsSize="small" onClick={this.handleReportPrint}><Glyphicon glyph="download-alt" /></Button>
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
