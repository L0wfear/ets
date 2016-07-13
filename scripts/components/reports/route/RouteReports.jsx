import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import { getFormattedDateTimeSeconds } from 'utils/dates';
import { datePickerFunction, getReportStatusLabel } from 'utils/labelFunctions';

let tableMeta = {
	cols: [
    {
      name: 'status',
      caption: 'Статус',
      type: 'text',
      filter: {
        type: 'select',
        labelFunction: getReportStatusLabel
      }
    },
		{
			name: 'operation_name',
			caption: 'Тех. операция',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'timestamp_create',
			caption: 'Дата создания',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
		{
			name: 'timestamp_process_begin',
			caption: 'Дата начала обработки',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
		{
			name: 'timestamp_process_end',
			caption: 'Дата завершения обработки',
			type: 'number',
			filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			},
		},
		{
			name: 'odh_fail_count',
			caption: 'Кол-во непокрытых',
			type: 'number',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'odh_total_count',
			caption: 'Общее кол-во',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'odh_success_count',
			caption: 'Кол-во покрытых',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
	]
}

let CarsTable = (props) => {

	const renderers = {
    status: ({data}) => <div>{data ? getReportStatusLabel(data) : ''}</div>,
    timestamp_create: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
	};

	return <Table title='Покрытие ОДХ маршрутами'
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      initialSort={tableMeta.cols[2].name}
      initialSortAscending={false}
      {...props} />

}

class RouteLaunchReports extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedCar: null,
			showForm: false,
      generationType: 'null',
		};
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('routes').getRouteReports();
		flux.getActions('technical_operation').getTechnicalOperations();
	}

  onReportSelect({props}) {
    const id = props.data.id;
    this.context.history.pushState(null, '/route-report/'+id);
  }

  handleGenerationTypeChange(type) {
    this.setState({generationType: type});
  }
  createRouteReport() {
    console.log(` creating report`, this.state.generationType);
		const { flux } = this.context;
		flux.getActions('routes').createRouteReport(this.state.generationType);
  }

	render() {

		const { reportsList = [], technicalOperationsList = [] } = this.props;
    const TECH_OPERATIONS = [{value: 'null', label: 'Все операции'}].concat(technicalOperationsList.filter((route) => route.object_name.indexOf('ОДХ') > -1).map(({id, name}) => ({value: id, label: name})));

		return (
			<div className="ets-page-wrap">
        <Div className="route-report-panel">
          <Button bsSize="small" onClick={this.createRouteReport.bind(this)}>Сформировать отчет</Button>
          <EtsSelect
							options={TECH_OPERATIONS}
							value={this.state.generationType}
							onChange={this.handleGenerationTypeChange.bind(this)}
							clearable={false} />
        </Div>
				<CarsTable data={reportsList} onRowSelected={this.onReportSelect.bind(this)}>
				</CarsTable>
			</div>
		);

	}
}

RouteLaunchReports.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(RouteLaunchReports, ['routes', 'objects']);
