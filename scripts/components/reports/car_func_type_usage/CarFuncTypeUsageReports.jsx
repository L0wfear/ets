import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col } from 'react-bootstrap';
import EtsSelect from 'components/ui/EtsSelect.jsx';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import Datepicker from 'components/ui/DatePicker.jsx';
import { getGeozoneTypeLabel} from 'utils/labelFunctions';
import { getToday9am, getTomorrow9am, getToday0am, getToday2359, getFormattedDateTime } from 'utils/dates';
import { getReportNotReadyNotification2 } from 'utils/notifications';
import { isEmpty } from 'utils/functions';
import CarFuncTypeUsageReportHeader from './CarFuncTypeUsageReportHeader.jsx';
import { FluxContext, HistoryContext, connectToStores } from 'utils/decorators';

let tableMeta = {
	cols: [
		{
			name: 'company_name',
			caption: 'Учреждение',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'func_type',
			caption: 'Тип техники',
			type: 'string',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'total_cars_count',
			caption: 'Всего',
			type: 'number',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'technical_operation',
			caption: 'Технологическая операция',
			type: 'string',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'cars_count',
			caption: 'Задействованная техника',
			type: 'number',
			filter: {
        type: 'select',
			},
		},
	]
}

let CarFuncTypeUsageReportsTable = (props) => {

	const renderers = {
    rowNumber: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    company_name: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    func_type: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    total_cars_count: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
	};

	return <Table title='Статистика выхода техники за период'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								enableSort={false}
								{...props} />

}

@connectToStores(['reports'])
@FluxContext
@HistoryContext
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

	componentDidMount() {
		const { flux } = this.context;
	}

  onReportSelect({props}) {
    const id = props.data.id;
    if (props.data.status !== 'success' && props.data.status !== 'fail') {
      global.NOTIFICATION_SYSTEM._addNotification(getReportNotReadyNotification2(this.context.flux));
    } else if (props.data.status !== 'fail'){
      this.context.history.pushState(null, `/daily-cleaning-report-ets/${props.data.element}/${id}`);
    }
  }

  handleChange(field, value) {
		this.setState({[field]: value});
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
            data={carFuncTypeUsageReportsList} />
			</div>
		);

	}
}
