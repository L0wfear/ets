import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import DateFormatter from '../ui/DateFormatter.jsx';
import { getFormattedDateTime } from 'utils/dates';
import MissionFormWrap from './MissionFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
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
        name: 'waybill_number',
        caption: 'Путевой лист',
        type: 'number',
        filter: {
  				type: 'select'
  			},
        cssClassName: 'width60',
      },
      {
				name: 'mission_source_name',
				caption: 'Источник',
				type: 'number',
				filter: {
					type: 'select',
				},
        cssClassName: 'width150',
			},
      {
				name: 'date_start',
				caption: 'Начало',
				type: 'date',
				filter: {
					type: 'select',
          labelFunction: (date) => getFormattedDateTime(date),
				},
			},
      {
				name: 'date_end',
				caption: 'Завершение',
				type: 'date',
				filter: {
					type: 'select',
          labelFunction: (date) => getFormattedDateTime(date),
				},
			},
      {
				name: 'car_gov_number',
				caption: 'Транспортное средство',
				type: 'number',
				filter: {
					type: 'select',
				},
        cssClassName: 'width120',
			},
      {
				name: 'route_name',
				caption: 'Маршрут',
				type: 'number',
				filter: {
					type: 'select',
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
		]
	};

	return tableMeta;

};


let MissionsTable = (props) => {

		const renderers = {
      status: ({data}) => <div>{getStatusLabel(data)}</div>,
      date_start: ({data}) => <DateFormatter date={data} time={true} />,
      date_end: ({data}) => <DateFormatter date={data} time={true} />,
		};

		return <Table title="Журнал заданий"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									initialSort={'number'}
									initialSortAscending={false}
									{...props}/>
}

export class MissionsJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMission;
    this.mainListName = 'missionsList';
		this.removeDisabled = () => this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned';
	}

  init() {
		const { flux } = this.context;
		flux.getActions('missions').getMissions();
  }

	completeMission() {
		let mission = _.cloneDeep(this.state.selectedElement);
		mission.status = 'complete';
		this.context.flux.getActions('missions').updateMission(mission);
	}

	rejectMission() {
		let reason = prompt('Введите причину', '');
		if (reason) {
			let mission = _.cloneDeep(this.state.selectedElement);
			mission.status = 'fail';
			mission.fail_reason = reason;
			this.context.flux.getActions('missions').updateMission(mission);
		}
	}

	render() {
		const { missionsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionsTable data={missionsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}{...this.props}>
					<Button bsSize="small" onClick={this.completeMission.bind(this)} disabled={this.state.selectedElement === null || this.state.selectedElement.status !== 'assigned'}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
					<Button bsSize="small" onClick={this.rejectMission.bind(this)} disabled={this.state.selectedElement === null || this.state.selectedElement.status !== 'assigned'}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать задание</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть задание</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null || this.removeDisabled()} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</MissionsTable>
				<MissionFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 element={this.state.selectedElement}
												 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(MissionsJournal, ['missions', 'objects', 'employees', 'routes']);
