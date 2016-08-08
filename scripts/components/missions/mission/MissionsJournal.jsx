import React, { Component } from 'react';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import MissionsTable from './MissionsTable.jsx';
import MissionFormWrap from './MissionFormWrap.jsx';
import MissionRejectForm from './MissionRejectForm.jsx';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoFormWrap.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { saveData } from 'utils/functions';
import { getWarningNotification } from 'utils/notifications';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import _ from 'lodash';

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

  completeCheckedElements() {
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

  rejectCheckedElements() {
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
				<Button bsSize="small" onClick={this.completeCheckedElements.bind(this)} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
				<Button bsSize="small" onClick={this.rejectCheckedElements.bind(this)} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
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
