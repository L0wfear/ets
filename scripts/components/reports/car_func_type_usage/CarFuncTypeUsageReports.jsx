import React, { Component } from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { getToday9am, getTomorrow9am, createValidDateTime } from 'utils/dates';
import CarFuncTypeUsageReportHeader from './CarFuncTypeUsageReportHeader.jsx';
import CarFuncTypeUsageReportsTable from './CarFuncTypeUsageReportsTable.jsx';
import { FluxContext, connectToStores, exportable, staticProps } from 'utils/decorators';

@connectToStores(['reports'])
@FluxContext
@staticProps({
  entity: 'car_func_type_usage_report'
})
@exportable
export default class CarFuncTypeUsageReports extends Component {

	constructor(props) {
		super(props);

    let [date_start, date_end] = [getToday9am(), getTomorrow9am()];

		this.state = {
      date_start,
      date_end,
      geozone_type: 'odh',
      company_id: null
		};
	}

  handleChange(field, value) {
		this.setState({[field]: value});
	}

	getCleanState(state) {
		return {
			...state,
			date_start: createValidDateTime(state.date_start),
			date_end: createValidDateTime(state.date_end)
		};
	}

  createDailyCleaningReportETS() {
		const { flux } = this.context;
		flux.getActions('reports').getCarFuncTypeUsageReports(this.state);
  }

	render() {

		const { carFuncTypeUsageReportsList = [] } = this.props;
    let currentCombination;
    _.each(carFuncTypeUsageReportsList, el => {
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
            {...this.state}/>
				<CarFuncTypeUsageReportsTable
            data={carFuncTypeUsageReportsList}>
					<Button disabled={!carFuncTypeUsageReportsList.length} bsSize="small" onClick={() => this.export(this.getCleanState(this.state))}><Glyphicon glyph="download-alt" /></Button>
				</CarFuncTypeUsageReportsTable>
			</div>
		);

	}
}
