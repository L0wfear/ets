import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';

let getStatusLabel = (status) => status === 'fail' ? 'Нет' : 'Да';
let getTypeLabel = (type) => type === 'distance' ? 'Протяженность' : type;

let statuses = {
  'full_traveled': 'Пройдено полностью',
  'not_traveled': 'Не пройдено',
  'traveled_less_than_half': 'Пройдено меньше половины',
  'traveled_more_than_half': 'Пройдено больше половины'
}

let getTableMeta = (props) => {

  console.log(props)

  let secondCol = {};

  if (props.element === 'roadway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь проезжей части, м2',
      type: 'number',
      filter: {
        type: 'select'
      }
    }
  }

  if (props.element === 'footway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь тротуаров с мехуборкой, м2',
      type: 'number',
      filter: {
        type: 'select'
      }
    }
  }

  if (props.element === 'yard') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Механизированная площадь двора, м2',
      type: 'number',
      filter: {
        type: 'select'
      }
    }
  }

  console.log(secondCol)


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
      {
        name: 'planned_passed_technical_operation_count',
        caption: 'Количество техопераций',
        type: 'string',
        filter: {
          type: 'select',
        }
      },
      {
        name: 'gov_number_list',
        caption: 'Список ТС',
        type: 'string',
        filter: {
          type: 'select',
        }
      },
      secondCol,
  		{
  			name: 'fact_traveled_area',
  			caption: 'Пройденная площадь',
  			type: 'string',
  			filter: {
  				type: 'select',
  			}
  		},
  		{
  			name: 'fact_finished_technical_operation_count',
  			caption: 'Выполнено ТО, количество',
  			type: 'string',
  			filter: {
  				type: 'select',
  			}
  		},
  	]
  };

  return tableMeta;
}


let MissionReportTable = (props) => {

	const renderers = {
    car_type_list: ({data}) => <div>{data.map(el => el.name).join(', ')}</div>,
    status: ({data}) => <div>{statuses[data] || ''}</div>,
    gov_number_list: ({data}) => <div>{data && data.join ? data.join(', ') : ''}</div>,
	};

  let tableMeta = getTableMeta(props);

  //if (!props.data.length) return <div/>

	return <Table title='Статус по выполнению технологических операций'
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
    try {
      console.log(this.props.routeParams);
  		let result = await flux.getActions('reports').getWeeklyTechnicalOperationCompleteReportById(this.props.routeParams.id);
      let selectedReportData = result.result[0].result.rows;
      this.setState({selectedReportData});
    } catch (e) {
      console.log(e);
      return;
    }
	}

  onReportSelect({props}) {
  }

	render() {

		const { selectedReportData = [] } = this.state;
    let element = this.props.routeParams.element;

		return (
			<div className="ets-page-wrap">
				<MissionReportTable data={selectedReportData} element={element} onRowSelected={this.onReportSelect.bind(this)}>
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
