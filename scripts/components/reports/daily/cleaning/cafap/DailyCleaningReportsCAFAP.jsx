import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getReportStatusLabel, getGeozoneTypeLabel} from 'utils/labelFunctions';
import { getToday9am, getTomorrow9am, getToday0am, getToday2359, getFormattedDateTimeSeconds } from 'utils/dates';
import { getReportNotReadyNotification2 } from 'utils/notifications';
import DailyReportHeader from 'components/reports/DailyReportHeader.jsx';
import _ from 'lodash';
import { FluxContext, HistoryContext, exportable, staticProps, connectToStores } from 'utils/decorators';

let getElementLabel = (el) => {
  let element = _.find([
    {value: 'roadway', label: 'Проезжая часть'},
    {value: 'footway', label: 'Тротуар'},
    {value: 'yard', label: 'Двор'}], obj => obj.value === el) || {};
  return element.label || '';
};

let tableMeta = {
	cols: [
		{
			name: 'status',
			displayName: 'Статус',
			type: 'text',
			filter: {
				type: 'select',
        labelFunction: getReportStatusLabel
			}
		},
		{
			name: 'geozone_type',
			displayName: 'Объект',
			type: 'number',
			filter: {
				type: 'select',
        labelFunction: getGeozoneTypeLabel
			},
		},
		{
			name: 'element',
			displayName: 'Элемент',
			type: 'number',
			filter: {
				type: 'select',
        labelFunction: (s) => getElementLabel(s)
			},
		},
		{
			name: 'date_start',
			displayName: 'Начало периода',
			type: 'number',
			filter: {
        type: 'date'
			},
		},
		{
			name: 'date_end',
			displayName: 'Конец периода',
			type: 'number',
			filter: {
        type: 'date'
			},
		},
		{
			name: 'timestamp_create',
			displayName: 'Дата создания',
			type: 'number',
			filter: {
        type: 'date'
			},
		},
		{
			name: 'timestamp_process_begin',
			displayName: 'Дата начала обработки',
			type: 'number',
			filter: {
        type: 'date'
			},
		},
		{
			name: 'timestamp_process_end',
			displayName: 'Дата завершения обработки',
			type: 'number',
			filter: {
        type: 'date'
			},
		},
	]
}

let DailyCleaningReportsTable = (props) => {

	const renderers = {
    status: ({data}) => <div>{data ? getReportStatusLabel(data) : ''}</div>,
    geozone_type: ({data}) => <div>{data ? getGeozoneTypeLabel(data) : ''}</div>,
    element: ({data}) => <div>{data ? getElementLabel(data) : ''}</div>,
    date_start: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    date_end: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_create: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_begin: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
    timestamp_process_end: ({data}) => <div>{data ? getFormattedDateTimeSeconds(data) : ''}</div>,
	};

	return <Table
      title='Статус по уборке (ЦАФАП)'
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      initialSort={'timestamp_create'}
      initialSortAscending={false}
      {...props} />

}

@connectToStores(['reports'])
@FluxContext
@HistoryContext
@staticProps({
  entity: 'geozone_element_traveled_daily_report__cafap'
})
@exportable
export default class DailyCleaningReportsCAFAP extends Component {

	constructor(props) {
		super(props);

    let [date_start, date_end] = [getToday9am(), getTomorrow9am()];

		this.state = {
      date_start,
      date_end,
      geozone_type: 'odh',
      element: 'roadway',
      car_type_id_list: [],
		};
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('reports').getDailyCleaningReportsCAFAP();
	}

  onReportSelect({props}) {
    const id = props.data.id;
    if (props.data.status !== 'success' && props.data.status !== 'fail') {
      global.NOTIFICATION_SYSTEM._addNotification(getReportNotReadyNotification2(this.context.flux));
    } else if (props.data.status !== 'fail'){
      this.context.history.pushState(null, `/daily-cleaning-report-cafap/${props.data.element}/${id}`);
    }
  }

  handleChange(field, value) {
		this.setState({[field]: value});
	}

  createDailyCleaningReportCAFAP() {
		const { flux } = this.context;
    const payload = _.cloneDeep(this.state);
    const { car_type_id_list, geozone_type } = payload;
    let newCarTypeIdList = [];
    if (geozone_type === 'dt') {
      car_type_id_list.map(el => {
        if (typeof el === 'string') {
          el = el.split(';').map(id => parseInt(id));
        }
        newCarTypeIdList.push(el);
        return el;
      });
      if (newCarTypeIdList.length) {
        newCarTypeIdList = newCarTypeIdList.reduce((a,b) => a.concat(b));
      }
      payload.car_type_id_list = newCarTypeIdList;
    }

    flux.getActions('reports').createDailyCleaningReportCAFAP(payload);
  }

	render() {

    // console.log('state is', this.state);

		const { dailyCleaningReportsListCAFAP = [] } = this.props;

		return (
			<div className="ets-page-wrap">
  			<DailyReportHeader
            handleChange={this.handleChange.bind(this)}
            onClick={this.createDailyCleaningReportCAFAP.bind(this)}
            useCombinations={true}
            {...this.state} />
				<DailyCleaningReportsTable
            data={dailyCleaningReportsListCAFAP}
            refreshable={true}
            onRefresh={() => this.context.flux.getActions('reports').getDailyCleaningReportsCAFAP()}
            onRowSelected={this.onReportSelect.bind(this)}>
          {/* <Button bsSize="small" onClick={() => this.export()}><Glyphicon glyph="download-alt"/></Button> */}
        </DailyCleaningReportsTable>
			</div>
		);

	}
}
