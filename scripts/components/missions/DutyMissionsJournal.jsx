import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import DateFormatter from '../ui/DateFormatter.jsx';
import { getFormattedDateTime } from 'utils/dates';
import DutyMissionFormWrap from './DutyMissionFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
import _ from 'lodash';

let getTechOperationById = (id) => window.__ETS_CONTAINER__.flux.getStore('objects').getTechOperationById(id);

let getMissionSourceById = (id) => window.__ETS_CONTAINER__.flux.getStore('missions').getMissionSourceById(id);

let getRouteById = (id) => window.__ETS_CONTAINER__.flux.getStore('routes').getRouteById(id);

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

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
      {
        name: 'status',
        caption: 'Статус',
        type: 'string',
        filter: {
  				type: 'select',
          labelFunction: (s) => getStatusLabel(s),
  			},
        cssClassName: 'width120'
      },
      {
        name: 'number',
        caption: 'Номер',
        type: 'number',
        filter: {
  				type: 'select'
  			},
        cssClassName: 'width60',
      },
      {
				name: 'mission_source_id',
				caption: 'Источник',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getMissionSourceById(id).name || id,
				},
        cssClassName: 'width120',
			},
      {
				name: 'technical_operation_name',
				caption: 'Технологическая операция',
				type: 'number',
				filter: {
					type: 'select',
				}
			},
      {
				name: 'plan_date_start',
				caption: 'Начало план.',
				type: 'date',
				filter: {
					type: 'select',
          labelFunction: (date) => getFormattedDateTime(date),
				},
			},
      {
				name: 'plan_date_end',
				caption: 'Завершение план.',
				type: 'date',
				filter: {
					type: 'select',
          labelFunction: (date) => getFormattedDateTime(date),
				},
			},
      {
				name: 'route_name',
				caption: 'Маршрут',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getRouteById(id).name || id,
				},
        cssClassName: 'width120',
			},
      {
        name: 'foreman_fio',
        caption: 'Бригадир',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
				name: 'comment',
				caption: 'Комментарий',
				type: 'string',
				filter: {
					type: 'select'
				},
        cssClassName: 'width120',
			},
      {
        name: 'car_mission_name',
        caption: 'Задание на ТС',
        type: 'string',
        filter: {
          type: 'select',
        }
      }
		]
	};

	return tableMeta;

};


let DutyMissionsTable = (props) => {

		const renderers = {
			technical_operation_id: ({data}) => <div>{getTechOperationById(data).name || data}</div>,
      mission_source_id: ({data}) => <div>{getMissionSourceById(data).name || data}</div>,
      status: ({data}) => <div>{getStatusLabel(data)}</div>,
      route_id: ({data}) => <div>{getRouteById(data).name || data}</div>,
      plan_date_start: ({data}) => <DateFormatter date={data} time={true} />,
      plan_date_end: ({data}) => <DateFormatter date={data} time={true} />,
		};

		return <Table title="Журнал наряд-заданий"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									initialSort={'number'}
									initialSortAscending={false}
									{...props}/>
}

export class DutyMissionsJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeDutyMission;
    this.mainListName = 'dutyMissionsList';
		this.removeDisabled = () => this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned';
	}

  init() {
		const { flux } = this.context;
		flux.getActions('missions').getDutyMissions();
    flux.getActions('missions').getMissionSources();
    flux.getActions('routes').getRoutes();
    flux.getActions('employees').getEmployees();
  }

	completeMission() {
		let mission = _.cloneDeep(this.state.selectedElement);
		mission.status = 'complete';
		this.context.flux.getActions('missions').updateDutyMission(mission);
	}

	rejectMission() {
		let reason = prompt('Введите причину', '');
		if (reason) {
			let mission = _.cloneDeep(this.state.selectedElement);
			mission.status = 'fail';
			mission.comment = reason;
			this.context.flux.getActions('missions').updateDutyMission(mission);
		}
	}

	render() {
		const { dutyMissionsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<DutyMissionsTable data={dutyMissionsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}{...this.props}>
					<Button bsSize="small" onClick={this.completeMission.bind(this)} disabled={this.state.selectedElement === null || this.state.selectedElement.status !== 'assigned'}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
					<Button bsSize="small" onClick={this.rejectMission.bind(this)} disabled={this.state.selectedElement === null || this.state.selectedElement.status !== 'assigned'}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать задание</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null || this.removeDisabled()} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</DutyMissionsTable>
				<DutyMissionFormWrap onFormHide={this.onFormHide.bind(this)}
												     showForm={this.state.showForm}
    												 element={this.state.selectedElement}
    												 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(DutyMissionsJournal, ['missions', 'objects', 'employees', 'routes']);
