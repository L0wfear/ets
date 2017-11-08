import * as React from 'react';
import _ from 'lodash';
import moment from 'moment';

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
  }
  createAction = formState =>
    this.context.flux.getActions('missions').createDutyMission(formState).then(() => {
      if (!this.props.fromFaxogrammMissionForm) {
        return this.props.refreshTableList();
      }
    });

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
    if (!this.props.fromFaxogrammMissionForm) {
      await this.props.refreshTableList();
    }
    this.context.flux.getActions('missions').getDutyMissions();
    this.props.onFormHide();
  }

  /**
   * Валидация формы
   * Если миссия создаётся из реестра централизованных заданий, то идёт проверка на даты на графницы поручения(централизованных заданий)
   * @override
   */
  validate(state, errors) {
    const formErrors = super.validate(state, errors);

    if (this.props.fromFaxogrammMissionForm && this.props.initDutyMission.plan_date_start) {
      const {
        initDutyMission: {
          plan_date_start: init_pds,
          plan_date_end: init_pde,
        } = {},
      } = this.props;
      const {
        plan_date_start: new_pds,
        plan_date_end: new_pde,
      } = state;

      if (moment(new_pds).toDate().getTime() < moment(init_pds).toDate().getTime()) {
        formErrors.plan_date_start = 'Дата не должна выходить за пределы действия поручения';
      }
      if (moment(new_pde).toDate().getTime() > moment(init_pde).toDate().getTime()) {
        formErrors.plan_date_end = 'Дата не должна выходить за пределы действия поручения';
      }
    }

    return formErrors;
  }
  /**
   * @override
   * @param {*} formState
   */
  updateAction(formState) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.context.flux.getActions('missions').updateDutyMission(formState, false);
        await this.props.refreshTableList();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
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
        readOnly={this.props.readOnly || !this.state.formState.is_new}
        fromFaxogrammMissionForm={!!this.props.fromFaxogrammMissionForm}
        {...this.state}
      />
    </Div>);
  }

}

export default DutyMissionFormWrap;
