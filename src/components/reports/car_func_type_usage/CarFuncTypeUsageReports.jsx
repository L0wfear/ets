import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import omit from 'lodash/omit';

import { getYesterday9am, getToday859am, createValidDateTime } from 'utils/dates';
import { FluxContext, HistoryContext, connectToStores, exportable } from 'utils/decorators';
import CarFuncTypeUsageReportHeader from './CarFuncTypeUsageReportHeader.jsx';
import CarFuncTypeUsageReportsTable from './CarFuncTypeUsageReportsTable.jsx';

@connectToStores(['reports', 'session'])
@exportable({ entity: 'car_usage_by_company' })
@FluxContext
@HistoryContext
export default class CarFuncTypeUsageReports extends Component {

  static get propTypes() {
    return {
      carFuncTypeUsageReportsList: PropTypes.array,
      export: PropTypes.func,
      isOkrug: PropTypes.bool,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      date_start: null,
      date_end: null,
      geozone_type: null,
      company_id: null,
    };
  }

  componentWillMount() {
    const {
      date_start = getYesterday9am(),
      date_end = getToday859am(),
      geozone_type = 'odh',
      company_id = null,
    } = this.props.location.query;


    const state = {
      date_start,
      date_end,
      geozone_type,
      company_id: company_id !== null ? Number(company_id) : null,
    };

    this.setState(state);

    this.context.history.pushState(null, '/car_func_type_usage_reports');
  }

  getCleanState(state) {
    return {
      ...state,
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value });
  }

  handleExport = () => {
    this.props.export(this.getCleanState(this.state));
  }

  handleReportSelect = ({ props }) => {
    console.log('handleReportSelect', props);
    const company_id = props.data.company_id;
    const geozone_type = props.data.geozone_type;
    const date_start = createValidDateTime(this.state.date_start);
    const date_end = createValidDateTime(this.state.date_end);
    this.context.history.pushState(null, `/car_func_type_usage_report/?date_start=${date_start}&date_end=${date_end}&company_id=${company_id}&geozone_type=${geozone_type}`);
  }
  createDailyCleaningReportETS = () => {
    const { flux } = this.context;
    const payload = omit({
      ...this.state,
      companies_ids: this.state.company_id,
    }, 'company_id');
    flux.getActions('reports').getCarFuncTypeUsageReports(payload);
  }

  render() {
    const { carFuncTypeUsageReportsList = [] } = this.props;
    const tableData = carFuncTypeUsageReportsList.map(item => ({
      ...item,
      geozone_type: this.state.geozone_type,
    }));

    return (
      <div className="ets-page-wrap">
        <CarFuncTypeUsageReportHeader
          handleChange={this.handleChange}
          onClick={this.createDailyCleaningReportETS}
          isOkrug={this.props.isOkrug}
          urlQueryParams={this.props.location.query}
          {...this.state}
        />
        <CarFuncTypeUsageReportsTable
          {...this.props}
          data={tableData}
          onRowSelected={this.handleReportSelect}
        >
          <Button
            disabled={!carFuncTypeUsageReportsList.length}
            bsSize="small"
            onClick={this.handleExport}
          >
            <Glyphicon glyph="download-alt" />
          </Button>
        </CarFuncTypeUsageReportsTable>
      </div>
    );
  }
}
