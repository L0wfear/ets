import React, { Component } from 'react';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import DutyMissionsTable from './DutyMissionsTable.jsx';
import DutyMissionFormWrap from './DutyMissionFormWrap.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import moment from 'moment';
import { getWarningNotification } from 'utils/notifications';
import _ from 'lodash';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['missions', 'objects'])
@staticProps({
	entity: 'duty_mission',
	listName: 'dutyMissionsList',
	tableComponent: DutyMissionsTable,
	formComponent: DutyMissionFormWrap,
	operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
	exportable: true
})
@exportable
export default class DutyMissionsJournal extends CheckableElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('missions').removeDutyMission;
    this.removeDisabled = () => {
      if (Object.keys(this.state.checkedElements).length !== 0) return false;
      if (this.state.selectedElement === null) {
        return true;
      } else {
        return this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned';
      }
    };
	}

	componentDidMount() {
		super.componentDidMount();
		const { flux } = this.context;
		flux.getActions('missions').getDutyMissions();
	}

  checkDisabled() {
    if (Object.keys(this.state.checkedElements).length !== 0) return false;

    if (this.state.selectedElement === null) {
      return true;
    } else {
      return this.state.selectedElement.status !== 'assigned';
    }
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

  completeCheckedElements() {
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'assigned') {
          let updatedMission = _.cloneDeep(mission);
          updatedMission.status = 'complete';
          this.context.flux.getActions('missions').updateDutyMission(updatedMission);
        }
      });
      this.setState({
				checkedElements: {}
			});
      global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification('Отметить как "Выполненые" можно только назначенные наряд-задания!'));
    } else {
      this.completeMission();
    }
  }

  rejectCheckedElements() {
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'assigned') {
          let reason = prompt(`Введите причину для наряд-задания №${mission.number}`, '');
          if (reason) {
            let updatedMission = _.cloneDeep(mission);
            updatedMission.status = 'fail';
            updatedMission.comment = reason;
            this.context.flux.getActions('missions').updateDutyMission(updatedMission);
          }
        }
      });
      this.setState({checkedElements: {}});
      global.NOTIFICATION_SYSTEM._addNotification(getWarningNotification('Отметить как "Невыполненые" можно только назначенные наряд-задания!'));
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

	getButtons() {
		const buttons = super.getButtons();

		buttons.push(
			<ButtonToolbar key={buttons.length}>
				<Button bsSize="small" onClick={this.completeCheckedElements.bind(this)} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
				<Button bsSize="small" onClick={this.rejectCheckedElements.bind(this)} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
				{/*<Button bsSize="small" onClick={this.handleSubmit.bind(this)}><Glyphicon glyph="download-alt" /></Button>*/}
			</ButtonToolbar>
		);

		return buttons;
	}
}
