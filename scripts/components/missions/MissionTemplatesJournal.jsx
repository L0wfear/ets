import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import MissionTemplateFormWrap from './MissionTemplateFormWrap.jsx';
import moment from 'moment';
import cx from 'classnames';

let getTechOperationById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getTechOperationById(id);
};

let getRouteById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getRouteById(id);
};

let getCarById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
  return objectsStore.getCarById(id);
};

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'number',
				caption: 'Номер',
				type: 'number',
        cssClassName: 'width60'
			},
      {
				name: 'name',
				caption: 'Название',
				type: 'string',
				// filter: {
				// 	type: 'select'
				// }
			},
      {
				name: 'car_id',
				caption: 'Транспортное средство',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getCarById(id).gov_number || id,
				},
        cssClassName: 'width120',
			},
      {
				name: 'route_id',
				caption: 'Маршрут',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getRouteById(id).name || id,
				},
        cssClassName: 'width120',
			},
      {
				name: 'passes_count',
				caption: 'Количество проходов',
				type: 'number',
				filter: {
					type: 'select'
				},
        cssClassName: 'width120'
			},
      {
				name: 'technical_operation_id',
				caption: 'Технологическая операция',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getTechOperationById(id).name || id,
				}
			},
		]
	};

	return tableMeta;

};


let MissionsTable = (props) => {

		const renderers = {
			technical_operation_id: ({data}) => <div>{getTechOperationById(data).name || data}</div>,
      route_id: ({data}) => <div>{getRouteById(data).name || data}</div>,
      car_id: ({data}) => <div>{getCarById(data).gov_number || data}</div>,
		};

		return <Table title="Шаблоны заданий"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									{...props}/>
}

class MissionsJournal extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedMission: null,
		};
	}

	selectMission({props}) {
		const id = props.data.id;
		let mission = _.find(this.props.missionTemplatesList, m => m.id === id);

		this.setState({ selectedMission: mission });
	}

	createMission() {
		this.setState({
			showForm: true,
			selectedMission: null
		})
	}

	onFormHide() {
		this.setState({
			showForm: false,
			selectedMission: null,
		});
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('missions').getMissionTemplates();
    flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTechOperations();
    flux.getActions('objects').getRoutes();
    //flux.getActions('missions').getMissionSources();
	}

	removeMission() {
		if (confirm('Вы уверены, что хотите удалить шаблон задания?')) {
			const { flux } = this.context;
			flux.getActions('missions').removeMissionTemplate(this.state.selectedMission.id);
		}
	}

	showMission() {
		this.setState({ showForm: true });
	}

	render() {

		const { missionTemplatesList = [] } = this.props;

		let showCloseBtn = this.state.selectedMission !== null && this.state.selectedMission.status !== 'active';

		return (
			<div className="ets-page-wrap">
				<MissionsTable data={missionTemplatesList} onRowSelected={this.selectMission.bind(this)} selected={this.state.selectedMission} selectField={'id'} {...this.props}>
					<Button bsSize="small" onClick={this.createMission.bind(this)}><Glyphicon glyph="plus" /> Создать шаблон задания</Button>
					<Button bsSize="small" onClick={this.showMission.bind(this)} disabled={true}>Сформировать задание</Button>
					<Button bsSize="small" onClick={this.showMission.bind(this)} disabled={this.state.selectedMission === null}><Glyphicon glyph="search" /> Просмотреть шаблон</Button>
					<Button bsSize="small" disabled={this.state.selectedMission === null} onClick={this.removeMission.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</MissionsTable>
				<MissionTemplateFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 mission={this.state.selectedMission}
												 {...this.props}/>
			</div>
		);
	}
}

MissionsJournal.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(MissionsJournal, ['missions', 'objects', 'employees']);
