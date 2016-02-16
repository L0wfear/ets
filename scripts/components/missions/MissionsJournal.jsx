import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import { getFormattedDateTime } from '../../utils/dates.js';
import MissionFormWrap from './MissionFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';

let getTechOperationById = (id) => window.__ETS_CONTAINER__.flux.getStore('objects').getTechOperationById(id);

let getMissionSourceById = (id) => window.__ETS_CONTAINER__.flux.getStore('missions').getMissionSourceById(id);

let getRouteById = (id) => window.__ETS_CONTAINER__.flux.getStore('routes').getRouteById(id);

let getCarById = (id) => window.__ETS_CONTAINER__.flux.getStore('objects').getCarById(id);

function getStatusLabel(s) {
	switch (s) {
		case 'assigned':
			return 'Назначено';
		case 'not_assigned':
			return 'Не назначено';
		case 'closed':
			return 'Закрыто';
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
        cssClassName: 'width300',
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
        cssClassName: 'width120',
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
      mission_source_id: ({data}) => <div>{getMissionSourceById(data).name || data}</div>,
      status: ({data}) => <div>{getStatusLabel(data)}</div>,
      route_id: ({data}) => <div>{getRouteById(data).name || data}</div>,
      date_start: ({data}) => <div>{getFormattedDateTime(data)}</div>,
      date_end: ({data}) => <div>{getFormattedDateTime(data)}</div>,
      car_id: ({data}) => <div>{getCarById(data).gov_number || data}</div>,
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

  static contextTypes = {
    flux: React.PropTypes.object,
  }

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMission;
    this.mainListName = 'missionsList';
	}

  init() {
		const { flux } = this.context;
		flux.getActions('missions').getMissions();
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
	}

	render() {
		const { missionsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionsTable data={missionsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}{...this.props}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать задание</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть задание</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null || this.state.selectedElement.status === 'assigned'} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</MissionsTable>
				<MissionFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 mission={this.state.selectedElement}
												 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(MissionsJournal, ['missions', 'objects', 'employees', 'routes']);
