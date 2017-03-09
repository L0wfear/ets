import React, { Component } from 'react';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { getDefaultDutyMission } from 'stores/MissionsStore.js';
import { saveData } from 'utils/functions';
import { dutyMissionSchema } from 'models/DutyMissionModel.js';
import DutyMissionForm from './DutyMissionForm.jsx';

class DutyMissionFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = dutyMissionSchema;
    this.defaultElement = getDefaultDutyMission();
    this.defaultElement.structure_id = context.flux.getStore('session').getCurrentUser().structure_id;
    this.createAction = (async) (formState) => {
      await context.flux.getActions('missions').createDutyMission(formState);
      context.flux.getActions('missions').getDutyMissions();
    };
    this.updateAction = context.flux.getActions('missions').updateDutyMission;
  }

  async handleFormPrint() {
    const mission = _.cloneDeep(this.state.formState);

    let response;

    if (mission.id) {
      response = await this.context.flux.getActions('missions').updateDutyMission(mission);
    } else {
      response = await this.context.flux.getActions('missions').createDutyMission(mission);
    }

    const id = mission.id ? mission.id : response.result && response.result[0] ? response.result[0].id : null;
    await this.context.flux.getActions('missions').printDutyMission(id).then(({ blob }) => { saveData(blob, `Печатная форма наряд-задания №${id}.pdf`); });
    this.context.flux.getActions('missions').getDutyMissions();
    this.props.onFormHide();
  }

  render() {
    return 	(<Div hidden={!this.props.showForm}>
      <DutyMissionForm
        formState={this.state.formState}
        onSubmit={this.handleFormSubmit.bind(this)}
        onPrint={this.handleFormPrint.bind(this)}
        handleFormChange={this.handleFormStateChange.bind(this)}
        show={this.props.showForm}
        onHide={this.props.onFormHide}
        fromWaybill={this.props.fromWaybill}
        {...this.state}
      />
    </Div>);
  }

}

export default DutyMissionFormWrap;
