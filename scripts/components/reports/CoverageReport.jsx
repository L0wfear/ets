import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon, Row, Col, Input } from 'react-bootstrap';
import Div from 'components/ui/Div.jsx';
import Field from 'components/ui/Field.jsx';
import PolyMap from '../map/PolyMap.jsx';
import _ from 'lodash';


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

class CoverageReport extends Component {

	constructor(props) {
		super(props);

		this.state = {
      structure_id: null,
      geozone_type: 'ODH',
			coverageReport: null,
			companyStructureList: [],
			checkedMissions: {}
		};
	}

  handleChange(field, value) {
		this.setState({[field]: value, coverageReport: null});
	}

	async handleSubmit() {
		let coverageReport = await this.context.flux.getActions('reports').getCoverageReport(this.state);
		await this.state.geozone_type === 'ODH' ? this.context.flux.getActions('objects').getODHs() : this.context.flux.getActions('objects').getDTs();
		await this.context.flux.getActions('routes').getGeozones();
		coverageReport = coverageReport.result.map((item, i) => {item.id = i; return item});
		this.setState({coverageReport, checkedMissions: _.extend({}, coverageReport)})
	}

	async componentDidMount() {
		let companyStructureList = await this.context.flux.getActions('company-structure').getLinearCompanyStructureForUser();
		this.setState({companyStructureList});
	}

	onFeatureClick(feature, ev, map) {
		let {id, name, state} = feature.getProperties();
		if (state === 2) return;
		const mission = this.state.coverageReport.find(r => r.missions.find(m => m.objects.indexOf(+id) > -1)).missions.find(m => m.objects.indexOf(+id) > -1);
		if (name) {
			let message = `<div class="header">
					№ задания: ${mission.number}</br>
					Статус: ${getStatusLabel(mission.status)}</div>`;
			map.popup.show(ev.coordinate, message);
		}
	}

	checkMission(id, state) {
		if (typeof id === 'number') {
			const missions = _.cloneDeep(this.state.checkedMissions);
			if (state) {
				missions[parseInt(id, 10)] = _.find(this.state.coverageReport, w => w.id === parseInt(id, 10));
			} else {
				delete missions[id];
			}
			this.setState({checkedMissions: missions}, this.onCheck.bind(this));
		} else {
			let checkedMissions = _.cloneDeep(this.state.checkedMissions);
			checkedMissions = state ? id : {};

			this.setState({checkedMissions}, this.onCheck.bind(this));
		}
	}

	onCheck() {

	}

	render() {

		let COMPANY_ELEMENTS = this.state.companyStructureList.map(el => ({value: el.id, label: el.name}));
		let object_list = this.state.geozone_type === 'ODH' ? this.props.odhsList : this.props.dtsList;
		let polys = this.state.geozone_type === 'ODH' ? this.props.odhPolys : this.props.dtPolys;

		if (this.state.coverageReport && object_list) {
			let usedObjects = _.values(this.state.coverageReport).map((item) => item.missions);
			usedObjects = _.flatten(usedObjects);
			usedObjects = usedObjects.map((item) => item.objects);
			usedObjects = _.flatten(usedObjects);

			let object_list_not_used = object_list
				.filter((object) => usedObjects.indexOf(object.id) === -1)
				.map(o => { o.shape = polys[this.state.geozone_type === 'ODH' ? o.id : o.dt_id].shape; return o; })
				.map(o => { o.state = 2; return o; });

			let object_list_used = object_list
				.filter((object) => usedObjects.indexOf(object.id) > -1)
				.map(o => { o.shape = polys[this.state.geozone_type === 'ODH' ? o.id : o.dt_id].shape; return o; })
				.map(o => {
					const mission = this.state.coverageReport.find(r => r.missions.find(m => m.objects.indexOf(this.state.geozone_type === 'ODH' ? o.id : o.dt_id) > -1)).missions.find(m => m.objects.indexOf(o.id) > -1);
					o.state = mission.status === 'complete' || mission.status === 'assigned' ? 4 : 2;
					return o;
				});

			let checkedMissions = _.values(this.state.checkedMissions).map((item) => item.missions);
			checkedMissions = _.flatten(checkedMissions);
			checkedMissions = checkedMissions.map((item) => item.objects);
			checkedMissions = _.flatten(checkedMissions);

			object_list_used = object_list_used.filter((object) => checkedMissions.indexOf(object.id) > -1);

			object_list = object_list_used.concat(object_list_not_used);

			polys = _.keyBy(object_list, 'id');
		}

		return (
			<div className="ets-page-wrap">
				<Div>
					<Row>
						<Col md={3}>
							<Field type="select" label="Подразделение"
									options={COMPANY_ELEMENTS}
									value={this.state.structure_id}
									onChange={this.handleChange.bind(this, 'structure_id')}/>
						</Col>
						<Col md={3}>
							<Div className="coverage-report-radio">
								<input
										type="radio"
										checked={this.state.geozone_type === 'ODH'}
										onChange={() => this.handleChange('geozone_type', 'ODH')}/><span>ОДХ</span>
								<input
										type="radio"
										checked={this.state.geozone_type === 'DT'}
										onChange={() => this.handleChange('geozone_type', 'DT')}/><span>ДТ</span>
								<Button onClick={this.handleSubmit.bind(this)}>Показать отчет</Button>
							</Div>
						</Col>
						<Col md={6}></Col>
					</Row>
					{!!this.state.coverageReport ? <Row>
						<Col md={7}>
							<Div className="route-creating">
								<PolyMap
										onFeatureClick={this.onFeatureClick.bind(this)}
										zoom={this.props.currentUser.map_config.zoom}
										center={this.props.currentUser.map_config.coordinates}
										object_list={object_list}
										polys={polys}
										objectsType={this.state.geozone_type.toLowerCase()}
										edit={false} />
							</Div>
						</Col>
						<Col md={5}>
							<ObjectsCoverReportTable
									noFilter={true}
									data={this.state.coverageReport}
									checked={this.state.checkedMissions}
									onRowChecked={this.checkMission.bind(this)}
									onAllRowsChecked={this.checkMission.bind(this)}>
							</ObjectsCoverReportTable>
						</Col>
					</Row> : ''}
				</Div>
			</div>
		);

	}
}

CoverageReport.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(CoverageReport, ['reports', 'session', 'objects', 'routes']);

let tableMeta = {
	cols: [
    {
      name: 'technical_operation_name',
      caption: 'Наименование',
			filter: false,
      type: 'string'
    },
    {
      name: 'coverage',
      caption: 'Объем выполняемых работ',
			filter: false,
      type: 'string',
			cssClassName: 'width60'
    },
	]
}

let ObjectsCoverReportTable = (props) => {

	const renderers = {
		isChecked: ({data}) => {
			console.dir(data);
		 return <input type="checkbox" />;
		}
	};

	return <Table
			title='Отчет'
			tableMeta={tableMeta}
			results={props.data}
			renderers={renderers}
			enumerated={false}
			multiSelection={true}
			{...props} />

}
