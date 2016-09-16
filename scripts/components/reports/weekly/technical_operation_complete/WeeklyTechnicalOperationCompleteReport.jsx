import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { exportable } from 'utils/decorators';
import { Button, Glyphicon } from 'react-bootstrap';

const getTableMeta = (props) => {
  const displayNameByElement = {
    'roadway': 'Площадь проезжей части, м2',
    'footway': 'Площадь тротуаров с мехуборкой, м2',
    'yard': 'Механизированная площадь двора, м2'
  };

  const tableMeta = {
    cols: [
      {
        name: 'geozone_name',
        displayName: 'Наименование объекта',
        type: 'string',
        filter: {
          type: 'select',
        },
      },
      {
        name: 'planned_passed_technical_operation_count',
        displayName: 'Количество техопераций',
        type: 'string',
        filter: {
          type: 'select',
        },
      },
      {
        name: 'gov_number_list',
        displayName: 'Список ТС',
        type: 'string',
        filter: false,
      },
      {
        name: 'geozone_element_area',
        displayName: displayNameByElement[props.element] || '',
        type: 'number',
        filter: false,
      },
      {
        name: 'fact_traveled_area',
        displayName: 'Пройденная площадь',
        type: 'string',
        filter: false,
      },
      {
        name: 'fact_finished_technical_operation_count',
        displayName: 'Выполнено ТО, количество',
        type: 'string',
        filter: {
          type: 'select',
        },
      },
    ],
  };

  return tableMeta;
};


const MissionReportTable = (props) => {
  const renderers = {
    gov_number_list: ({ data }) => <div>{data && data.join ? data.join(', ') : ''}</div>,
  };

  const tableMeta = getTableMeta(props);

  // if (!props.data.length) return <div/>

  return (<Table title="Статус по выполнению технологических операций"
    tableMeta={tableMeta}
    results={props.data}
    renderers={renderers}
    {...props}
  />);
};

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
      const result = await flux.getActions('reports').getWeeklyTechnicalOperationCompleteReportById(this.props.routeParams.id);
      const selectedReportData = result.result.rows;
      this.setState({ selectedReportData });
    } catch (e) {
      console.log(e);
      return;
    }
  }

  onReportSelect({ props }) {
  }

  render() {
    const { selectedReportData = [] } = this.state;
    const element = this.props.routeParams.element;

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
