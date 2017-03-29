import React, { Component, PropTypes } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { getYesterday9am, getToday859am, createValidDateTime } from 'utils/dates';
import { FluxContext, connectToStores, exportable, staticProps } from 'utils/decorators';
import _ from 'lodash';
import CarFuncTypeUsageReportHeader from './CarFuncTypeUsageReportHeader.jsx';
import CarFuncTypeUsageReportsTable from './CarFuncTypeUsageReportsTable.jsx';

@connectToStores(['reports', 'session'])
@exportable({ entity: 'car_func_type_usage_report' })
@FluxContext
@staticProps({
  entity: 'car_func_type_usage_report',
})
export default class CarFuncTypeUsageReports extends Component {

  static get propTypes() {
    return {
      carFuncTypeUsageReportsList: PropTypes.array,
    };
  }

  constructor(props) {
    super(props);

    const [date_start, date_end] = [getYesterday9am(), getToday859am()];

    this.state = {
      date_start,
      date_end,
      geozone_type: 'odh',
      company_id: null,
    };
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  getCleanState(state) {
    return {
      ...state,
      date_start: createValidDateTime(state.date_start),
      date_end: createValidDateTime(state.date_end),
    };
  }

  createDailyCleaningReportETS() {
    const { flux } = this.context;
    flux.getActions('reports').getCarFuncTypeUsageReports(this.state);
  }

  render() {
    const { carFuncTypeUsageReportsList = [] } = this.props;
    let currentCombination;
    _.each(carFuncTypeUsageReportsList, (el) => {
      if (!currentCombination || currentCombination !== `${el.company_name}${el.func_type}`) {
        currentCombination = `${el.company_name}${el.func_type}`;
      } else {
        el.hidden = true;
      }
    });

    return (
      <div className="ets-page-wrap">
        <CarFuncTypeUsageReportHeader
          handleChange={this.handleChange.bind(this)}
          onClick={this.createDailyCleaningReportETS.bind(this)}
          {...this.state}
        />
        <CarFuncTypeUsageReportsTable
          data={carFuncTypeUsageReportsList}
        >
          <Button disabled={!carFuncTypeUsageReportsList.length} bsSize="small" onClick={() => this.props.export(this.getCleanState(this.state))}><Glyphicon glyph="download-alt" /></Button>
        </CarFuncTypeUsageReportsTable>
      </div>
    );
  }
}
