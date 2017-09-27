import React, { Component, PropTypes } from 'react';
import _ from 'lodash';


import Table from 'components/ui/table/DataTable.jsx';
import { Button, Row, Col } from 'react-bootstrap';
import { connectToStores, FluxContext } from 'utils/decorators';
import { ExtDiv } from 'components/ui/Div.jsx';
import { ExtField } from 'components/ui/Field.jsx';
import PolyMap from '../map/PolyMap.jsx';

function getStatusLabel(s) {
  switch (s) {
    case 'assigned':
      return 'Назначено';
    case 'not_assigned':
      return 'Не назначено';
    case 'complete':
      return 'Выполнено';
    case 'fail':
      return 'Не выполнено';
    default:
      return s;
  }
}

@connectToStores(['reports', 'session', 'objects', 'routes', 'geoObjects'])
@FluxContext
export default class CoverageReport extends Component {
  static get propTypes() {
    return {
      companyStructureLinearForUserList: PropTypes.array,
      odhsList: PropTypes.array,
      dtsList: PropTypes.array,
      odhPolys: PropTypes.array,
      dtPolys: PropTypes.array,
      currentUser: PropTypes.object,
    };
  }

  static get defaultProps() {
    return {
      companyStructureLinearForUserList: [],
      odhsList: [],
      dtsList: [],
      odhPolys: [],
      dtPolys: [],
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      structure_id: null,
      geozone_type: 'ODH',
      coverageReport: null,
      checkedMissions: {},
    };
  }

  componentDidMount() {
    const linear = true;
    const descendants_by_user = true;

    this.context.flux.getActions('companyStructure').getCompanyStructure(linear, descendants_by_user);
  }

  onFeatureClick = (feature, ev, map) => {
    const { id, name, state } = feature.getProperties();
    if (state === 2) return;
    const mission = this.state.coverageReport.find(r => r.missions.find(m => m.objects.indexOf(+id) > -1)).missions.find(m => m.objects.indexOf(+id) > -1);
    if (name) {
      const message = `<div class="header">
          № задания: ${mission.number}</br>
          Статус: ${getStatusLabel(mission.status)}</div>`;
      map.popup.show(ev.coordinate, message);
    }
  }

  onCheck() {
  }

  checkMission = (id, state) => {
    if (typeof id === 'number') {
      const missions = _.cloneDeep(this.state.checkedMissions);
      if (state) {
        missions[parseInt(id, 10)] = _.find(this.state.coverageReport, w => w.id === parseInt(id, 10));
      } else {
        delete missions[id];
      }
      this.setState({ checkedMissions: missions }, this.onCheck.bind(this));
    } else {
      let checkedMissions = _.cloneDeep(this.state.checkedMissions);
      checkedMissions = state ? id : {};

      this.setState({ checkedMissions }, this.onCheck.bind(this));
    }
  }

  handleChange(field, value) {
    this.setState({ [field]: value, coverageReport: null });
  }

  async handleSubmit() {
    const { flux } = this.context;
    const geozone_type = this.state.geozone_type === 'ODH' ? 'ODHs' : 'DT';

    let coverageReport = await flux.getActions('reports').getCoverageReport(this.state);
    await flux.getActions('geoObjects')[`get${geozone_type}`]();
    await flux.getActions('geoObjects').getGeozones();
    coverageReport = coverageReport.result.map((item, i) => { item.id = i; return item; });
    this.setState({ coverageReport, checkedMissions: _.extend({}, coverageReport) });
  }

  render() {
    const {
      companyStructureLinearForUserList = [],
      odhsList = [],
      dtsList = [],
      odhPolys = [],
      dtPolys = [],

    } = this.props;
    const COMPANY_ELEMENTS = companyStructureLinearForUserList.map(el => ({ value: el.id, label: el.name }));
    let object_list = this.state.geozone_type === 'ODH' ? odhsList : dtsList;
    let polys = this.state.geozone_type === 'ODH' ? odhPolys : dtPolys;

    if (this.state.coverageReport && object_list) {
      let usedObjects = _.values(this.state.coverageReport).map(item => item.missions);
      usedObjects = _.flatten(usedObjects);
      usedObjects = usedObjects.map(item => item.objects);
      usedObjects = _.flatten(usedObjects);

      const object_list_not_used = object_list
        .filter(object => usedObjects.indexOf(object.id) === -1)
        .map((o) => { o.shape = polys[this.state.geozone_type === 'ODH' ? o.id : o.dt_id].shape; return o; })
        .map((o) => { o.state = 2; return o; });

      let object_list_used = object_list
        .filter(object => usedObjects.indexOf(object.id) > -1)
        .map((o) => { o.shape = polys[this.state.geozone_type === 'ODH' ? o.id : o.dt_id].shape; return o; })
        .map((o) => {
          const mission = this.state.coverageReport.find(r => r.missions.find(m => m.objects.indexOf(this.state.geozone_type === 'ODH' ? o.id : o.dt_id) > -1)).missions.find(m => m.objects.indexOf(o.id) > -1);
          o.state = mission.status === 'complete' || mission.status === 'assigned' ? 4 : 2;
          return o;
        });

      const checkedMissions = _(this.state.checkedMissions)
        .values()
        .map(item => item.missions)
        .flatten(checkedMissions)
        .map(item => item.objects)
        .flatten(checkedMissions)
        .value();

      object_list_used = object_list_used.filter(object => checkedMissions.indexOf(object.id) > -1);

      object_list = object_list_used.concat(object_list_not_used);

      polys = _.keyBy(object_list, 'id');
    }

    return (
      <div className="ets-page-wrap">
        <ExtDiv>
          <Row>
            <Col md={3}>
              <ExtField
                type="select"
                label="Подразделение"
                options={COMPANY_ELEMENTS}
                emptyValue={null}
                value={this.state.structure_id}
                onChange={this.handleChange}
                boundKeys={['structure_id']}
              />
            </Col>
            <Col md={3}>
              <ExtDiv className="coverage-report-radio">
                <input
                  type="radio"
                  checked={this.state.geozone_type === 'ODH'}
                  onChange={() => this.handleChange('geozone_type', 'ODH')}
                /><span>ОДХ</span>
                <input
                  type="radio"
                  checked={this.state.geozone_type === 'DT'}
                  onChange={() => this.handleChange('geozone_type', 'DT')}
                /><span>ДТ</span>
                <Button onClick={this.handleSubmit.bind(this)}>Показать отчет</Button>
              </ExtDiv>
            </Col>
            <Col md={6} />
          </Row>
          {this.state.coverageReport ? <Row>
            <Col md={7}>
              <ExtDiv className="route-creating">
                <PolyMap
                  onFeatureClick={this.onFeatureClick}
                  zoom={this.props.currentUser.map_config.zoom}
                  center={this.props.currentUser.map_config.coordinates}
                  object_list={object_list}
                  polys={polys}
                  objectsType={this.state.geozone_type.toLowerCase()}
                  edit={false}
                />
              </ExtDiv>
            </Col>
            <Col md={5}>
              <ObjectsCoverReportTable
                noHeader
                data={this.state.coverageReport}
                checked={this.state.checkedMissions}
                onRowChecked={this.checkMission}
                onAllRowsChecked={this.checkMission}
              />
            </Col>
          </Row> : ''}
        </ExtDiv>
      </div>
    );
  }
}

const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Наименование',
      filter: false,
      type: 'string',
    },
    {
      name: 'coverage',
      displayName: 'Объем выполняемых работ',
      filter: false,
      type: 'string',
      cssClassName: 'width60',
    },
  ],
};

const ObjectsCoverReportTable = (props) => {
  const renderers = {
    isChecked: ({ data }) => <input type="checkbox" />,
  };

  return (
    <Table
      title="Отчет"
      tableMeta={tableMeta}
      results={props.data}
      renderers={renderers}
      enumerated={false}
      multiSelection
      {...props}
    />
  );
};
