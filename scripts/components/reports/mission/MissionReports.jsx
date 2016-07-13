import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getFormattedDateTimeSeconds, getDatesByShift } from 'utils/dates';
import { getReportNotReadyNotification } from 'utils/notifications';
import { datePickerFunction, getReportStatusLabel, getGeozoneTypeLabel} from 'utils/labelFunctions';


let FaxogrammsDatepicker = (props) => {
	return (
		<Row>
			<Col md={3}>
			</Col>
			<Col md={6} className="faxogramms-date-range">
				<Div className="inline-block faxogramms-date">
					<Datepicker date={ props.mission_date_start_from } onChange={props.handleChange.bind(null, 'mission_date_start_from')}/>
				</Div>
				<Div className="date-divider">—</Div>
				<Div className="inline-block">
					<Datepicker date={ props.mission_date_end_to } onChange={props.handleChange.bind(null, 'mission_date_end_to')}/>
				</Div>
			</Col>
      <Col md={3}>
        <Button bsSize="small" onClick={props.onClick.bind(this)}>Сформировать отчет</Button>
      </Col>
		</Row>
	)
}

let getStatusLabel = (status) => {
  let result = '';

  switch (status) {
    case 'fail':
      result = 'Ошибка';
      break;
    case 'success':
      result = 'Обработан';
      break;
    case 'in progress':
      result = 'В обработке';
      break;
    case 'wait':
      result = 'В очереди';
      break;
  }

  return result;
};

let getTypeLabel = (type) => type === 'distance' ? 'Протяженность' : type;

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
			name: 'mission_name',
			caption: 'Задание',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'technical_operation_name',
			caption: 'Тех. операция',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'timestamp_create',
			caption: 'Дата создания',
			type: 'number',
			filter: false
		},
		{
			name: 'timestamp_process_begin',
			caption: 'Дата начала обработки',
			type: 'number',
			filter: false
		},
		{
			name: 'timestamp_process_end',
			caption: 'Дата завершения обработки',
			type: 'number',
			filter: false
		},
	]
}

let MissionReportsTable = (props) => {

	const renderers = {
    status: ({data}) => <div>{data ? getReportStatusLabel(data) : ''}</div>,
    timestamp_create: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
	};

	return <Table title='Прохождение заданий'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class RouteLaunchReports extends Component {

	constructor(props) {
		super(props);

    let [mission_date_start_from, mission_date_end_to] = getDatesByShift();

		this.state = {
      mission_date_start_from,
      mission_date_end_to,
		};
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('missions').getMissionReports();
	}

  onReportSelect({props}) {
    const id = props.data.id;
    if (props.data.status !== 'success') {
      global.NOTIFICATION_SYSTEM._addNotification(getReportNotReadyNotification(this.context.flux));
    } else {
      this.context.history.pushState(null, `/mission-report/${id}`);
    }
  }

  handleChange(field, value) {
		this.setState({[field]: value});
	}

  createMissionReport() {
		const { flux } = this.context;
		flux.getActions('missions').createMissionReport(this.state.mission_date_start_from, this.state.mission_date_end_to);
  }

	render() {

		const { missionReportsList } = this.props;

		return (
			<div className="ets-page-wrap">
  			<FaxogrammsDatepicker handleChange={this.handleChange.bind(this)} onClick={this.createMissionReport.bind(this)} {...this.state}/>

				<MissionReportsTable data={missionReportsList} onRowSelected={this.onReportSelect.bind(this)} />
			</div>
		);

	}
}

RouteLaunchReports.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(RouteLaunchReports, ['missions', 'objects']);
