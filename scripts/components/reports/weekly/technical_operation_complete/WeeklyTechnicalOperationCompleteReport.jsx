import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { exportable } from 'utils/decorators';
import { Button, Glyphicon } from 'react-bootstrap';

let getTableMeta = (props) => {

  let secondCol = {};

  if (props.element === 'roadway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь проезжей части, м2',
      type: 'number',
      filter: false
    }
  }

  if (props.element === 'footway') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Площадь тротуаров с мехуборкой, м2',
      type: 'number',
      filter: false
    }
  }

  if (props.element === 'yard') {
    secondCol = {
      name: 'geozone_element_area',
      caption: 'Механизированная площадь двора, м2',
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
  			filter: false
      },
      secondCol,
  		{
  			name: 'fact_traveled_area',
  			caption: 'Пройденная площадь',
  			type: 'string',
  			filter: false
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

@exportable
class MissionReport extends Component {


	constructor(props) {
		super(props);

    this.state = {
      selectedReportData: [],
    };
    this.entity = 'status_of_technical_operation_execution_weekly_report/' + this.props.routeParams.id;
	}

	async componentDidMount() {
		const { flux } = this.context;
    try {
  		let result = await flux.getActions('reports').getWeeklyTechnicalOperationCompleteReportById(this.props.routeParams.id);
      let selectedReportData = result.result.rows;
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
          <Button bsSize="small" onClick={() => this.export()}><Glyphicon glyph="download-alt" /></Button>
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
