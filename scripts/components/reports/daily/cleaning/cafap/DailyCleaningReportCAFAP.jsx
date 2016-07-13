import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { getPeriodicReportStatusLabel } from 'utils/labelFunctions';
import { Input } from 'react-bootstrap';
import { getFormattedDateTime } from 'utils/dates';

let getTableMeta = (props) => {

  let secondCol = {};

  if (props.element === 'roadway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь проезжей части',
      type: 'number',
      filter: false
    }
  }

  if (props.element === 'footway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь тротуаров с мехуборкой',
      type: 'number',
      filter: false
    }
  }

  if (props.element === 'yard') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Механизированная площадь двора',
      type: 'number',
      filter: false
    }
  }

  let tableMeta = {
  	cols: [
      {
        name: 'geozone_name',
        caption: 'Наименование объекта',
        type: 'string',
        filter: {
          type: 'select',
        },
      },
      secondCol,
      {
        name: 'car_type_list',
        caption: 'Тип техники',
        type: 'string',
        filter: false
      },
      {
        name: 'gov_number_list',
        caption: 'Список ТС',
        type: 'string',
        filter: false
      },
  		{
  			name: 'fact_traveled_area',
  			caption: 'Пройдено',
  			type: 'string',
  			filter: false
  		},
  		{
  			name: 'planned_passed_count',
  			caption: 'Плановое посещение',
  			type: 'string',
  			filter: {
  				type: 'select',
  			}
  		},
      {
        name: 'fact_traveled_percentage',
        caption: 'Процент посещения',
        type: 'string',
        filter: false
      },
  		{
  			name: 'status',
  			caption: 'Статус посещения',
  			type: 'string',
  			filter: {
  				type: 'select',
          labelFunction: getPeriodicReportStatusLabel
  			},
  		}
  	]
  };

  return tableMeta;
}


let MissionReportTable = (props) => {



	const renderers = {
    car_type_list: ({data}) => <div>{data.map(el => el.name).join(', ')}</div>,
    status: ({data}) => <div>{getPeriodicReportStatusLabel(data) || ''}</div>,
    gov_number_list: ({data}) => <div>{data && data.join ? data.join(', ') : ''}</div>,
	};

  let tableMeta = getTableMeta(props);

  //if (!props.data.length) return <div/>

	return <Table title='Статус по уборке (ЦАФАП)'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReport extends Component {


	constructor(props) {
		super(props);

    this.state = {
      selectedReportData: [],
    };
	}

	async componentDidMount() {
    const { flux } = this.context;
		let result = await flux.getActions('reports').getDailyCleaningReportByIdCAFAP(this.props.routeParams.id);
    let selectedReportData = result.result[0].result.rows;
    let dateFrom = getFormattedDateTime(result.result[0].date_start);
    let dateTo = getFormattedDateTime(result.result[0].date_end);
    this.setState({selectedReportData, dateFrom, dateTo});
	}

  onReportSelect({props}) {
  }

	render() {

		const { selectedReportData = [], dateFrom, dateTo } = this.state;
    let element = this.props.routeParams.element;

		return (
			<div className="ets-page-wrap">
				<MissionReportTable data={selectedReportData} element={element} onRowSelected={this.onReportSelect.bind(this)}>
          <div className="daily-cleaning-report-period">
            Период формирования:
            <Input type="text" readOnly value={dateFrom}></Input> —
            <Input type="text" readOnly value={dateTo}></Input>
          </div>
				</MissionReportTable>
			</div>
		);

	}
}

MissionReport.contextTypes = {
  history: React.PropTypes.object,
	flux: React.PropTypes.object,
};

export default connectToStores(MissionReport, ['missions']);
