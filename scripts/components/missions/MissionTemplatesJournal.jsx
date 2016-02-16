import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import MissionTemplateFormWrap from './MissionTemplateFormWrap.jsx';
import { MissionsJournal } from './MissionsJournal.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';

let getTechOperationById = (id) => window.__ETS_CONTAINER__.flux.getStore('objects').getTechOperationById(id);

let getRouteById = (id) => window.__ETS_CONTAINER__.flux.getStore('routes').getRouteById(id);

let getCarById = (id) => window.__ETS_CONTAINER__.flux.getStore('objects').getCarById(id);

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
				filter: {
					type: 'select'
				}
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
									initialSort={'number'}
									initialSortAscending={false}
                  multiSelection={true}
									{...props}/>
}

class MissionTemplatesJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMissionTemplate;
    this.mainListName = 'missionTemplatesList';
		this.state = {
			selectedMission: null,
      checkedMissions: {},
			formType: 'ViewForm',
		};
	}

	selectMission({props}) {
		const id = props.data.id;
		let mission = _.find(this.props.missionTemplatesList, m => m.id === id);

		this.setState({ selectedMission: mission });
	}

  checkMission(id, state) {
    const missions = _.cloneDeep(this.state.checkedMissions);
    if (state) {
      missions[parseInt(id, 10)] = _.find(this.props.missionTemplatesList, m => m.id === parseInt(id, 10));
    } else {
      delete missions[id];
    }
    this.setState({
      checkedMissions: missions
    });
  }

  checkAll(rows, state) {
    let checkedMissions = _.cloneDeep(this.state.checkedMissions);
    if (state) {
      checkedMissions = rows;
    } else {
      checkedMissions = {};
    }
    this.setState({checkedMissions});
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

  init() {
		const { flux } = this.context;
		flux.getActions('missions').getMissionTemplates();
  }

  componentDidMount() {
    this.init();
		const { flux } = this.context;
    flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTechOperations();
    flux.getActions('routes').getRoutes();
    flux.getActions('objects').getCars();
    flux.getActions('missions').getMissionSources();
    flux.getActions('routes').getRoutes();
    flux.getActions('missions').getMissionSources();
	}

	removeMission() {
		if (confirm('Вы уверены, что хотите удалить шаблон задания?')) {
			const { flux } = this.context;
			flux.getActions('missions').removeMissionTemplate(this.state.selectedMission.id);
		}
	}

	showMission() {
		this.setState({ showForm: true, formType: "ViewForm" });
	}

  createMissions() {
    this.setState({ showForm: true, formType: "MissionsCreationForm" });
  }

	render() {

		const { missionTemplatesList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionsTable data={missionTemplatesList} onAllRowsChecked={this.checkAll.bind(this)} onRowChecked={this.checkMission.bind(this)} onRowSelected={this.selectMission.bind(this)} selected={this.state.selectedMission} selectField={'id'} {...this.props}>
					<Button bsSize="small" onClick={this.createMission.bind(this)}><Glyphicon glyph="plus" /> Создать шаблон задания</Button>
					<Button bsSize="small" onClick={this.createMissions.bind(this)} disabled={Object.keys(this.state.checkedMissions).length === 0}>Сформировать задание</Button>
					<Button bsSize="small" onClick={this.showMission.bind(this)} disabled={this.state.selectedMission === null}><Glyphicon glyph="search" /> Просмотреть шаблон</Button>
					<Button bsSize="small" disabled={this.state.selectedMission === null} onClick={this.removeMission.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</MissionsTable>
				<MissionTemplateFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 mission={this.state.selectedMission}
                         formType={this.state.formType}
                         missions={this.state.checkedMissions}
												 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(MissionTemplatesJournal, ['missions', 'objects', 'employees', 'routes']);
