import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import DateFormatter from '../ui/DateFormatter.jsx';
import { getFormattedDateTime } from 'utils/dates';
import { datePickerFunction } from 'utils/labelFunctions';
import MissionFormWrap from './MissionFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';
import { getWarningNotification } from 'utils/notifications';
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
					type: 'date_create',
					labelFunction: datePickerFunction
				},
			},
      {
				name: 'date_end',
				caption: 'Завершение',
				type: 'date',
				filter: {
					type: 'date_create',
					labelFunction: datePickerFunction
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
      isChecked: ({data}) => {
        console.dir(data);
       return <input type="checkbox" />;
      }
		};

		return <Table title="Журнал заданий"
									results={props.data}
									renderers={renderers}
									tableMeta={getTableMeta(props)}
									initialSort={'number'}
									initialSortAscending={false}
                  multiSelection={true}
									{...props}/>
}

export class MissionsJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMission;
    this.mainListName = 'missionsList';
		this.removeDisabled = () => {
      if (Object.keys(this.state.checkedMissions).length !== 0) return false;

      if (this.state.selectedElement === null) {
        return true;
      }
      else {
        return this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned';
      }
    };

    this.state = {
      selectedElement: null,
      checkedMissions: {}
    };
	}

	componentDidMount() {
		super.componentDidMount();
		const { flux } = this.context;
		flux.getActions('missions').getMissions();
	}

  stateChangeCallback() {
    if (typeof this.props.onListStateChange === 'function') {
      this.props.onListStateChange(this.state);
    }
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

  checkMission(id, state) {
    const missions = _.cloneDeep(this.state.checkedMissions);
    if (state) {
      missions[parseInt(id, 10)] = _.find(this.props.missionsList, w => w.id === parseInt(id, 10));
    } else {
      delete missions[id];
    }
    this.setState({checkedMissions: missions}, this.stateChangeCallback.bind(this));
  }

  checkAll(rows, state) {
    let checkedMissions = _.cloneDeep(this.state.checkedMissions);
    checkedMissions = state ? rows : {};

    this.setState({checkedMissions}, this.stateChangeCallback.bind(this));
  }

  removeCheckedElements() {
    if (typeof this.removeElementAction !== 'function') return;

    if (Object.keys(this.state.checkedMissions).length !== 0) {
      if (!confirm('Вы уверены, что хотите удалить выбранные элементы?')) return;
        let isNotDeleted = false;

        _.forEach(this.state.checkedMissions, function(mission) {
          if (mission.status === 'not_assigned') {
            this.removeElementAction(mission.id);
          }
          else isNotDeleted = true;
        });

        if (isNotDeleted) {
          global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification('Удалились только задания со статусом "Не назначено"!'));
        }
    }
    else {
      this.removeElement();
    }
  }

	render() {
		const { missionsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<MissionsTable data={missionsList} onAllRowsChecked={this.checkAll.bind(this)} onRowChecked={this.checkMission.bind(this)} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} checked={this.state.checkedMissions} selectField={'id'}{...this.props}>
					<Button bsSize="small" onClick={this.completeMission.bind(this)} disabled={this.state.selectedElement === null || this.state.selectedElement.status !== 'assigned'}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
					<Button bsSize="small" onClick={this.rejectMission.bind(this)} disabled={this.state.selectedElement === null || this.state.selectedElement.status !== 'assigned'}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать задание</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть</Button>
					<Button bsSize="small" disabled={this.removeDisabled()} onClick={this.removeCheckedElements.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
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
