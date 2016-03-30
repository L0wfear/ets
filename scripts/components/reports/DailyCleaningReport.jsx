import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';

let getStatusLabel = (status) => status === 'fail' ? 'Нет' : 'Да';
let getTypeLabel = (type) => type === 'distance' ? 'Протяженность' : type;


let getTableMeta = (props) => {

  console.log(props)

  let secondCol = {};

  if (props.data[0] && props.data[0].element === 'carriageway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь проезжей части',
      type: 'number',
      filter: {
        type: 'select'
      }
    }
  }

  if (props.data[0] && props.data[0].element === 'footway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь тротуаров с мехуборкой',
      type: 'number',
      filter: {
        type: 'select'
      }
    }
  }

  if (props.data[0] && props.data[0].element === 'yard') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Механизированная площадь двора',
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
      secondCol,
      {
        name: 'car_type_list',
        caption: 'Тип техники',
        type: 'string',
        filter: {
          type: 'select',
        }
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
  			name: 'fact_traveled_area',
  			caption: 'Пройденная площадь',
  			type: 'string',
  			filter: {
  				type: 'select',
  			}
  		},
  		{
  			name: 'status',
  			caption: 'Статус посещения',
  			type: 'string',
  			filter: {
  				type: 'select',
  			},
  		},
  	]
  };

  return tableMeta;
}


let MissionReportTable = (props) => {



	const renderers = {
    car_type_list: ({data}) => <div>{data.map(el => el.name).join(', ')}</div>
	};

  let tableMeta = getTableMeta(props);

  if (!props.data.length) return <div/>

	return <Table title='Прохождение заданий'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class MissionReport extends Component {


	constructor(props) {
		super(props);

    this.state = {
      selectedReportData: []
    }
	}

	async componentDidMount() {
		const { flux } = this.context;
    try {
  		let result = await flux.getActions('reports').getDailyCleaningReportById(this.props.routeParams.id);
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

		return (
			<div className="ets-page-wrap">
				<MissionReportTable data={selectedReportData} onRowSelected={this.onReportSelect.bind(this)}>
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
