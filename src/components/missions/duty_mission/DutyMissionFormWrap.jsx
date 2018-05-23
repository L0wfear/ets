import * as React from 'react';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { getDefaultDutyMission } from 'stores/MissionsStore.js';
import { saveData } from 'utils/functions';
import dutyMissionSchema from 'models/DutyMissionModel.js';
import DutyMissionForm from './DutyMissionForm.jsx';

class DutyMissionFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = dutyMissionSchema;
    this.defaultElement = getDefaultDutyMission();
    this.defaultElement.structure_id = context.flux.getStore('session').getCurrentUser().structure_id;
  }

  handleFormPrint = async () => {
    const mission = _.cloneDeep(this.state.formState);

    let response;

    if (mission.id) {
      response = await this.context.flux.getActions('missions').updateDutyMission(mission);
    } else {
      response = await this.context.flux.getActions('missions').createDutyMission(mission);
    }

    const id = mission.id ? mission.id : response.result && response.result[0] ? response.result[0].id : null;
    await this.context.flux.getActions('missions').printDutyMission(id).then(({ blob }) => { saveData(blob, `Печатная форма наряд-задания №${id}.pdf`); });
    try {
      if (!this.props.fromOrder && !this.props.fromDashboard) {
        await this.props.refreshTableList();
      }
    } catch (e) {
      // function refreshTableList not in father modules
    }
    this.props.onFormHide();
  }

  createAction = async (formState) => {
    try {
      await this.context.flux.getActions('missions').createDutyMission(formState);
      if (!this.props.fromOrder && !this.props.fromDashboard) {
        await this.props.refreshTableList();
      }
    } catch (error) {
      // function refreshTableList not in father modules
    }
  }

  /**
   * @override
   * @param {*} formState
   */
  updateAction(formState) {
    return new Promise(async (resolve) => {
      try {
        await this.context.flux.getActions('missions').updateDutyMission(formState, false);
        await this.props.refreshTableList();
        resolve();
      } catch (error) {
        // function refreshTableList not in father modules
      }
    });
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <DutyMissionForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit.bind(this)}
          onPrint={this.handleFormPrint}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          fromWaybill={this.props.fromWaybill}
          readOnly={this.props.readOnly}
          {...this.state}
        />
      </Div>
    );
  }

}

export default DutyMissionFormWrap;
