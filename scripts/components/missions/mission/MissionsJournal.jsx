import React, { Component } from 'react';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import { getFormattedDateTime } from 'utils/dates';
import { datePickerFunction } from 'utils/labelFunctions';
import MissionFormWrap from './MissionFormWrap.jsx';
import MissionRejectForm from './MissionRejectForm.jsx';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoFormWrap.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { saveData } from 'utils/functions';
import cx from 'classnames';
import { getWarningNotification } from 'utils/notifications';
import { connectToStores, staticProps } from 'utils/decorators';
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
				name: 'car_gov_number',
				caption: 'Транспортное средство',
				type: 'number',
				display: false,
				filter: {
					type: 'select',
				},
			},
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
				filter: false,
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
			{
	      name: 'id',
	      caption: 'Показать на карте',
				filter: false,
				cssClassName: 'map-view'
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
      isChecked: ({data}) => <input type="checkbox"/>,
			id: (meta) => {
				if (meta.rowData.status === 'not_assigned') return <div>Нет данных</div>;
					return <div>
						<span onClick={() => props.mapView(meta.data)}>
							<Glyphicon glyph="info-sign" />
						</span>
					</div>
			},
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

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@staticProps({
	entity: 'mission',
	listName: 'missionsList',
	tableComponent: MissionsTable,
	operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE']
})
export default class MissionsJournal extends CheckableElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMission;
		this.removeDisabled = () => {
      if (Object.keys(this.state.checkedElements).length !== 0) return false;

      if (this.state.selectedElement === null) {
        return true;
      } else {
        return this.state.selectedElement.status !== 'not_assigned';
      }
    };

		this.state = Object.assign(this.state, {
			showMissionRejectForm: false,
			showMissionInfoForm: false,
    });
	}

	componentDidMount() {
		super.componentDidMount();
		const { flux } = this.context;
		flux.getActions('missions').getMissions();
	}

  checkDisabled() {
    if (Object.keys(this.state.checkedElements).length !== 0) return false;

    if (this.state.selectedElement === null) {
      return true;
    } else {
      return this.state.selectedElement.status !== 'assigned';
    }
  }

	checkDisabledDelete() {
		return super.checkDisabledDelete() &&
		  this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned';
	}

	completeMission() {
		let mission = _.cloneDeep(this.state.selectedElement);
		mission.status = 'complete';
		this.context.flux.getActions('missions').updateMission(mission);
	}

	rejectMission() {
		this.setState({showMissionRejectForm: true});
	}

  completecheckedElements() {
		let error = false;
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'assigned') {
          let updatedMission = _.cloneDeep(mission);
          updatedMission.status = 'complete';
          this.context.flux.getActions('missions').updateMission(updatedMission);
        } else error = true;
      });
      this.setState({checkedElements: {}});
      if (error) global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification('Отметить как "Выполненые" можно только назначенные задания!'));
    } else {
      this.completeMission();
    }
  }

  rejectcheckedElements() {
		let error = false;
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'assigned') {
          console.log('mission', mission);
          let reason = prompt(`Введите причину для задания №${mission.number}`, '');
          if (reason) {
            let updatedMission = _.cloneDeep(mission);
            updatedMission.status = 'fail';
            updatedMission.comment = reason;
            this.context.flux.getActions('missions').updateMission(updatedMission);
          }
        } else error = true;
      });
      this.setState({checkedElements: {}});
      if (error) global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification('Отметить как "Невыполненые" можно только назначенные задания!'));
    }
    else {
      this.rejectMission();
    }
  }

  removeCheckedElements() {
    if (typeof this.removeElementAction !== 'function') return;

    if (Object.keys(this.state.checkedElements).length !== 0) {
      if (!confirm('Вы уверены, что хотите удалить выбранные элементы?')) return;

      let isNotDeleted = false;

      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'not_assigned') {
          this.removeElementAction(mission.id);
        } else {
					isNotDeleted = true;
				}
      });

      if (isNotDeleted) {
        global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification('Удалились только задания со статусом "Не назначено"!'));
      }
			this.setState({
				checkedElements: {},
				selectedElement: null,
			});

    } else {
      this.removeElement();
    }
  }

	handleSubmit() {
		const { flux } = this.context;
		flux.getActions('missions').getMissionAnalyticalReport().then(blob => {saveData(blob, `Отчет по заданиям.xls`)});
	}

	onReject(refresh) {
		this.setState({showMissionRejectForm: false});
		refresh && this.context.flux.getActions('missions').getMissions();
	}

	async mapView(id) {
		let mission = await this.context.flux.getActions('missions').getMissionData(id);
		this.setState({mission: mission.result[0], showMissionInfoForm: true});
	}

	getForms() {
		return [
			<div key={'forms'}>
				<MissionFormWrap onFormHide={this.onFormHide.bind(this)}
						showForm={this.state.showForm}
						element={this.state.selectedElement}
						{...this.props}/>
				<MissionRejectForm
						show={this.state.showMissionRejectForm}
						onReject={this.onReject.bind(this)}
						mission={this.state.selectedElement} />
				<MissionInfoFormWrap
						onFormHide={() => this.setState({showMissionInfoForm: false})}
						showForm={this.state.showMissionInfoForm}
						element={this.state.mission} />
			</div>
		]
	}

	getButtons() {
		const buttons = super.getButtons();

		buttons.push(
			<ButtonToolbar key={buttons.length}>
				<Button bsSize="small" onClick={this.completecheckedElements.bind(this)} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
				<Button bsSize="small" onClick={this.rejectcheckedElements.bind(this)} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
				<Button bsSize="small" onClick={this.handleSubmit.bind(this)}><Glyphicon glyph="download-alt" /></Button>
			</ButtonToolbar>
		);

		return buttons;
	}

	getAdditionalProps() {
		return {
			mapView: this.mapView.bind(this)
		}
	}

}
