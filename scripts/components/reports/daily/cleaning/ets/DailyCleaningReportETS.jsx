import React, { Component } from 'react';
import { Input, Button, Glyphicon } from 'react-bootstrap';
import { FluxContext, connectToStores, exportable } from 'utils/decorators';
import { getFormattedDateTime } from 'utils/dates';
import DailyCleaningReportETSTable from './DailyCleaningReportETSTable.jsx';

@connectToStores(['missions'])
@FluxContext
@exportable
export default class DailyCleaningReportETS extends Component {

	constructor(props) {
		super(props);

    this.state = {
      selectedReportData: [],
      dateFrom: '',
      dateTo: ''
    };

    this.entity = 'geozone_element_traveled_daily_report__ets/' + this.props.routeParams.id;
	}

	async componentDidMount() {
		const { flux } = this.context;
		let result = await flux.getActions('reports').getDailyCleaningReportByIdETS(this.props.routeParams.id);
    let selectedReportData = result.result.rows;
    let dateFrom = getFormattedDateTime(result.result.meta.date_start);
    let dateTo = getFormattedDateTime(result.result.meta.date_end);
    this.setState({selectedReportData, dateFrom, dateTo});
	}

	render() {

		const { selectedReportData = [], dateFrom, dateTo } = this.state;
    let element = this.props.routeParams.element;

		return (
			<div className="ets-page-wrap">
				<DailyCleaningReportETSTable data={selectedReportData} element={element}>
          <div className="daily-cleaning-report-period">
            Период формирования:
            <Input type="text" readOnly value={dateFrom}></Input> —
            <Input type="text" readOnly value={dateTo}></Input>
          </div>
          <Button bsSize="small" onClick={() => this.export()}><Glyphicon glyph="download-alt" /></Button>
				</DailyCleaningReportETSTable>
			</div>
		);

	}
}
