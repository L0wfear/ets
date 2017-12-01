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
      if (!this.props.fromOrder && !this.props.fromDashboard) {
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
    if (!this.props.fromOrder && !this.props.fromDashboard) {
      await this.props.refreshTableList();
    }
    this.props.onFormHide();
  }

  /**
   * Валидация формы
   * Если миссия создаётся из реестра централизованных заданий, то идёт проверка на даты на графницы поручения(централизованных заданий)
   * @override
   */
  validate(state, errors) {
    const formErrors = super.validate(state, errors);

    if (this.props.fromOrder && this.props.initDutyMission && this.props.initDutyMission.plan_date_start) {
      const {
        initDutyMission: {
          plan_date_start: init_pds,
          plan_date_end: init_pde,
          passes_count: init_pc,
        } = {},
      } = this.props;
      const {
        plan_date_start: new_pds,
        plan_date_end: new_pde,
        passes_count: new_pc,
      } = state;

      if (moment(new_pds).toDate().getTime() < moment(init_pds).toDate().getTime()) {
        formErrors.plan_date_start = 'Дата не должна выходить за пределы действия поручения';
      }
      if (moment(new_pde).toDate().getTime() > moment(init_pde).toDate().getTime()) {
        formErrors.plan_date_end = 'Дата не должна выходить за пределы действия поручения';
      }
      if (new_pc > init_pc) {
        formErrors.passes_count = '"Кол-во проходов" не должно превышать значение "Кол-во проходов" из поручения';
      }
      if (new_pc <= 0) {
        formErrors.passes_count = '"Кол-во проходов" должно быть больше нуля';
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
        try {
          await this.props.refreshTableList();
        } catch(e) {
          // ну а вдруг
        }
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
        fromOrder={!!this.props.fromOrder}
        {...this.state}
      />
    </Div>);
  }

}

export default DutyMissionFormWrap;
