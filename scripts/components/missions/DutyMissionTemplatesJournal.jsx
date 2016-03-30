import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import DutyMissionTemplateFormWrap from './DutyMissionTemplateFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';

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
				name: 'route_name',
				caption: 'Маршрут',
				type: 'string',
				filter: {
					type: 'select',
				},
        cssClassName: 'width120',
			},
      {
				name: 'technical_operation_name',
				caption: 'Технологическая операция',
				type: 'string',
				filter: {
					type: 'select',
				}
			},
      {
				name: 'comment',
				caption: 'Комментарий',
				type: 'string',
				filter: {
					type: 'select',
				}
			},
		]
	};

	return tableMeta;

};


let DutyMissionsTable = (props) => {

		const renderers = {
      // route_id: ({data}) => <div>{getRouteById(data).name || data}</div>,
		};

		return <Table title="Шаблоны наряд-заданий"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									initialSort={'number'}
									initialSortAscending={false}
                  multiSelection={true}
									{...props}/>
}

class DutyMissionTemplatesJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeDutyMissionTemplate;
    this.mainListName = 'dutyMissionTemplatesList';
		this.state = {
			selectedElement: null,
      checkedDutyMissions: {},
			formType: 'ViewForm',
      showForm: false,
		};
	}

	stateChangeCallback() {
		if (typeof this.props.onListStateChange === 'function') {
			this.props.onListStateChange(this.state);
		}
	}

  checkDutyMission(id, state) {
    const missions = _.cloneDeep(this.state.checkedDutyMissions);
    if (state) {
      missions[parseInt(id, 10)] = _.find(this.props.dutyMissionTemplatesList, m => m.id === parseInt(id, 10));
    } else {
      delete missions[id];
    }
    this.setState({checkedDutyMissions: missions}, this.stateChangeCallback.bind(this));
  }

  checkAll(rows, state) {
    let checkedDutyMissions = _.cloneDeep(this.state.checkedDutyMissions);
    checkedDutyMissions = state ? rows : {};

    this.setState({checkedDutyMissions}, this.stateChangeCallback.bind(this));
  }

	onFormHide(clearCheckedDutyMissions) {
		this.setState({
			showForm: false,
			selectedElement: null,
			checkedDutyMissions: clearCheckedDutyMissions ? {} : this.state.checkedDutyMissions,
		});
	}

  init() {
		const { flux } = this.context;
		let { payload = {} } = this.props;
		flux.getActions('missions').getDutyMissionTemplates(payload);
    flux.getActions('missions').getMissionSources();
  }

	showDutyMission() {
		this.setState({ showForm: true, formType: "ViewForm" });
	}

  createDutyMissions() {
    this.setState({ showForm: true, formType: "MissionsCreationForm" });
  }

	render() {

		const { dutyMissionTemplatesList = [], noFilter = false } = this.props;

		return (
			<div className="ets-page-wrap">
				<DutyMissionsTable noFilter={noFilter} data={dutyMissionTemplatesList} onAllRowsChecked={this.checkAll.bind(this)} onRowChecked={this.checkDutyMission.bind(this)} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} checked={this.state.checkedDutyMissions} selectField={'id'} {...this.props}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать шаблон задания</Button>
					<Button bsSize="small" onClick={this.createDutyMissions.bind(this)} disabled={Object.keys(this.state.checkedDutyMissions).length === 0}>Сформировать наряд-задание</Button>
					<Button bsSize="small" onClick={this.showDutyMission.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть шаблон</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</DutyMissionsTable>
				<DutyMissionTemplateFormWrap onFormHide={this.onFormHide.bind(this)}
    																 showForm={this.state.showForm}
    																 element={this.state.selectedElement}
    				                         formType={this.state.formType}
    				                         missions={this.state.checkedDutyMissions}
    																 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(DutyMissionTemplatesJournal, ['missions', 'objects', 'employees', 'routes']);
