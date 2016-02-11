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

let getRouteVectorById = (id) => window.__ETS_CONTAINER__.flux.getStore('routes').getRouteVectorById(id);

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
          labelFunction: (id) => getRouteVectorById(id).name || id,
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
      route_id: ({data}) => <div>{getRouteVectorById(data).name || data}</div>,
      car_id: ({data}) => <div>{getCarById(data).gov_number || data}</div>,
		};

		return <Table title="Шаблоны заданий"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									{...props}/>
}

class MissionTemplatesJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMissionTemplate;
    this.mainListName = 'missionTemplatesList';
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
	}

	render() {

		const { missionTemplatesList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionsTable data={missionTemplatesList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} {...this.props}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать шаблон задания</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={true}>Сформировать задание</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть шаблон</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</MissionsTable>
				<MissionTemplateFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 mission={this.state.selectedElement}
												 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(MissionTemplatesJournal, ['missions', 'objects', 'employees', 'routes']);
