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
		//this.keyPressDisabled = true;
		this.doubleClickDisabled = true;
		this.state = {
			selectedMission: null,
      checkedMissions: {},
			formType: 'ViewForm',
		};
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
    }, () => {
			if (typeof this.props.onListStateChange === 'function') {
				this.props.onListStateChange(this.state);
			}
		});
  }

  checkAll(rows, state) {
    let checkedMissions = _.cloneDeep(this.state.checkedMissions);
    checkedMissions = state ? rows : {};

    this.setState({checkedMissions});
  }

	onFormHide(clearCheckedMissions) {
		this.setState({
			showForm: false,
			selectedElement: null,
			checkedMissions: clearCheckedMissions ? {} : this.state.checkedMissions,
		});
	}

  init() {
		const { flux } = this.context;
		let { payload = {} } = this.props;
		flux.getActions('missions').getMissionTemplates(payload);
    flux.getActions('objects').getWorkKinds();
    flux.getActions('objects').getTechOperations();
    flux.getActions('routes').getRoutes();
    flux.getActions('objects').getCars();
    flux.getActions('missions').getMissionSources();
  }

	showMission() {
		this.setState({ showForm: true, formType: "ViewForm" });
	}

  createMissions() {
    this.setState({ showForm: true, formType: "MissionsCreationForm" });
  }

	render() {

		const { missionTemplatesList = [], noFilter = false } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionsTable noFilter={noFilter} data={missionTemplatesList} onAllRowsChecked={this.checkAll.bind(this)} onRowChecked={this.checkMission.bind(this)} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} checked={this.state.checkedMissions} selectField={'id'} {...this.props}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать шаблон задания</Button>
					<Button bsSize="small" onClick={this.createMissions.bind(this)} disabled={Object.keys(this.state.checkedMissions).length === 0}>Сформировать задание</Button>
					<Button bsSize="small" onClick={this.showMission.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть шаблон</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</MissionsTable>
				<MissionTemplateFormWrap onFormHide={this.onFormHide.bind(this)}
																 showForm={this.state.showForm}
																 element={this.state.selectedElement}
				                         formType={this.state.formType}
				                         missions={this.state.checkedMissions}
																 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(MissionTemplatesJournal, ['missions', 'objects', 'employees', 'routes']);
